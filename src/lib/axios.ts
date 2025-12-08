"use client";

import { API_ROUTES } from "@/constants/apiRoutes";
import { useUserStore } from "@/stores/userStore";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

const axiosInstanceWithAuth = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

axiosInstanceWithAuth.interceptors.request.use(
  (config: AxiosRequestConfig): InternalAxiosRequestConfig<any> => {
    const token = useUserStore.getState().accessToken;
    config.headers = config.headers || {};

    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config as InternalAxiosRequestConfig<any>;
  },
  (error: any) => Promise.reject(error)
);

axiosInstanceWithAuth.interceptors.response.use(
  (res: any) => res,
  async (err: any) => {
    const originalRequest = err.config;
    const refreshToken = useUserStore.getState().refreshToken;
    const { logout } = useUserStore.getState();

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axiosInstanceWithAuth(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post(
          API_ROUTES.AUTH.REFRESH_TOKEN,
          {
            refreshToken,
          }
        );

        if (
          !response?.data?.data?.accessToken ||
          !response?.data?.data?.refreshToken
        ) {
          throw new Error("No access token and refresh token found!");
        }

        const newAccessToken = response.data.data.accessToken;
        useUserStore.getState().setAccessToken(newAccessToken);
        useUserStore.getState().setRefreshToken(response.data.data.refreshToken);
        axiosInstanceWithAuth.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);
        return axiosInstanceWithAuth(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export async function refreshTokenIfPossible(): Promise<boolean> {
  const refreshToken = useUserStore.getState().refreshToken;
  if (!refreshToken) return false;

  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    const newAccessToken = response?.data?.data?.accessToken;
    const newRefreshToken = response?.data?.data?.refreshToken;
    if (!newAccessToken || !newRefreshToken) return false;

    useUserStore.getState().setAccessToken(newAccessToken);
    useUserStore.getState().setRefreshToken(newRefreshToken);
    axiosInstanceWithAuth.defaults.headers.common["Authorization"] =
      "Bearer " + newAccessToken;

    return true;
  } catch (err) {
    return false;
  }
}

export { axiosInstanceWithAuth, axiosInstance };
