import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { store } from "@/store/store";
import { userLogout } from "@/store/slices/user.slice";
import { AdminLogout } from "@/store/slices/adminSlice";
import { useToast } from "@/hooks/use-toast";
import { InterceptorOptions } from "@/types/Types";
import { ADMIN_PREFIX,USER_PREFIX } from "@/types/Types";

const { toast } = useToast();

let isRefreshing = false;

function setupAxiosInterceptor(
  instance: AxiosInstance,
  { refreshTokenUrl, logoutAction, redirectPath, check401 }: InterceptorOptions
): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
      const originalRequest = error.config as any;

      // Handle token expiration (401)
      if (check401(error) && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await instance.post(refreshTokenUrl);
            isRefreshing = false;
            return instance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            store.dispatch(logoutAction());
            window.location.href = redirectPath;
            toast({
              title: "Error",
              description: "Please Login again",
              variant: "destructive",
              duration: 3000,
            });
            return Promise.reject(refreshError);
          }
        }
      }

      // Handle forbidden access (403)
      if (
        (error.response?.status === 403 &&
          error.response.data?.message === "Token is blacklisted") ||
        (error.response?.status === 403 &&
          error.response.data?.message === "Access denied: Your account has been blocked" &&
          !originalRequest._retry)
      ) {
        store.dispatch(logoutAction());
        window.location.href = redirectPath;
        toast({
          title: "Error",
          description: "Please Login again",
          variant: "destructive",
          duration: 3000,
        });
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
}

// Create user axios instance
export const userAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PRIVATE_URL + USER_PREFIX,
  withCredentials: true,
});

setupAxiosInterceptor(userAxiosInstance, {
  refreshTokenUrl: "/refresh-token",
  logoutAction: userLogout,
  redirectPath: "/",
  check401: (error) => error.response?.status === 401,
});

// Create admin axios instance
export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PRIVATE_URL + ADMIN_PREFIX,
  withCredentials: true,
});

setupAxiosInterceptor(adminAxiosInstance, {
  refreshTokenUrl: "/refresh-token",
  logoutAction: AdminLogout,
  redirectPath: "/admin",
  check401: (error) =>
    error.response?.status === 401 &&
    error.response?.data?.message === "Token Expired",
});
