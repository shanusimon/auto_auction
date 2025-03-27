import axios from "axios";
import { store } from "@/store/store";
import { AdminLogout } from "@/store/slices/adminSlice";
import { toast } from "@/hooks/use-toast";

export const adminAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_PRIVATE_URL,
    withCredentials: true,
});

let isRefreshing = false;

adminAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("error",error)
        const originalRequest = error.config;
        console.log("hello",originalRequest);

        if (error.response?.status === 401 && !originalRequest._retry && error.response.data.message === "Token Expired") {
            console.log("its inside")
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    console.log("hello123")
                    await adminAxiosInstance.post("/_ad/admin/refresh-token");
                    isRefreshing = false;
                    return adminAxiosInstance(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    store.dispatch(AdminLogout());
                    window.location.href = "/admin";
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

        if (
            (error.response.status === 403 && error.response.data.message === "Token is blacklisted") ||
            (error.response.status === 403 && error.response.data.message === "Access denied: Your account has been blocked" && !originalRequest._retry)
        ) {
            console.log("Session ended");
            store.dispatch(AdminLogout());
            window.location.href = "/admin";
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
