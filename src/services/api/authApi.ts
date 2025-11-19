import { API_ROUTES } from "@/constants/apiRoutes";
import { axiosInstance, axiosInstanceWithAuth } from "@/lib/axios";
import { AxiosError } from "axios";

export const fetchTextToSign = async () => {
  try {
    const url = API_ROUTES.AUTH.TEXT_TO_SIGN;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

interface LoginBody {
  jwtSignature: string;
}

export const fetchLogin = async (body: LoginBody) => {
  try {
    const url = API_ROUTES.AUTH.LOGIN;

    const response = await axiosInstance.post(url, body);
    return response.data;
  } catch (error: any) {
    throw new Error(
      (error instanceof AxiosError && error.response?.data?.message) ||
      (error as any)?.message ||
      'Failed to fetch login'
    );
  }
};

export const fetchAuthUser = async () => {
  try {
    const url = API_ROUTES.AUTH.ME;

    const response = await axiosInstanceWithAuth.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(
      (error instanceof AxiosError && error.response?.data?.message) ||
      (error as any)?.message ||
      'Failed to fetch auth user'
    );
  }
};