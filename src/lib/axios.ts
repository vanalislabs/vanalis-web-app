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
  // 1. Check if we are already refreshing to prevent race conditions
  if (isRefreshing) {
    // If a refresh is already happening via interceptor, we should wait for it
    // or simply return true assuming the interceptor will handle it.
    // For simplicity in this context, we return false to stop THIS caller, 
    // but a robust solution would return a promise that resolves when failedQueue resolves.
    return new Promise(resolve => {
        failedQueue.push({ resolve: () => resolve(true), reject: () => resolve(false) })
    });
  }

  const refreshToken = useUserStore.getState().refreshToken;
  if (!refreshToken) return false;

  // 2. Set the lock
  isRefreshing = true; 

  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    
    const newAccessToken = response?.data?.data?.accessToken;
    const newRefreshToken = response?.data?.data?.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
        throw new Error("Invalid token response");
    }

    useUserStore.getState().setAccessToken(newAccessToken);
    useUserStore.getState().setRefreshToken(newRefreshToken);
    axiosInstanceWithAuth.defaults.headers.common["Authorization"] =
      "Bearer " + newAccessToken;
    
    // 3. Process the queue for any requests caught by interceptor while we were manually refreshing
    processQueue(null, newAccessToken);
    
    return true;
  } catch (err) {
    processQueue(err, null); // Kill any pending requests
    return false;
  } finally {
    // 4. Release the lock
    isRefreshing = false;
  }
}

export { axiosInstanceWithAuth, axiosInstance };
