import { userAxiosInstance } from "@/api/axios";
import { ChangePasswordData } from "@/hooks/user/userDashboard";
import { CreateCarDTO, CarFilterReturn } from "@/types/CarFormTypes";
import {
  CreateCommentDto,
  SellerRequestPayload,
  WalletTransactionsResponse,
} from "@/types/Types";
import { Post } from "@/types/Post.Types";

export const logoutUser = async (): Promise<void> => {
  await userAxiosInstance.post("/logout");
};

export const carDetails = async (carId: string): Promise<any> => {
  const { data } = await userAxiosInstance.get(`/car/${carId}`);
  return data;
};

export const getCars = async (
  year?: number,
  transmission?: string,
  bodyType?: string,
  fuel?: string,
  sort: string = "ending-soon",
  page: number = 1,
  limit: number = 20
): Promise<CarFilterReturn[]> => {
  const queryParams = new URLSearchParams({
    ...(year && { year: year.toString() }),
    ...(bodyType && { bodyType }),
    ...(fuel && { fuel }),
    ...(transmission && { transmission }),
    sort,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const { data } = await userAxiosInstance.get(`/cars?${queryParams}`);
  return data.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await userAxiosInstance.patch("/change-password", data);
};

export const getAllTransaction = async (
  page: number = 1,
  limit: number = 6
): Promise<WalletTransactionsResponse> => {
  const { data } = await userAxiosInstance.get("/getAllTransaction", {
    params: { page, limit },
  });
  return data.data;
};

export const getWalletBalance = async (): Promise<number> => {
  const { data } = await userAxiosInstance.get("/getWalletBalance");
  return data;
};

export const getIsSeller = async (): Promise<boolean> => {
  const { data } = await userAxiosInstance.get("/seller-status");
  return data;
};

export const getSellerRequest = async (
  payload: SellerRequestPayload
): Promise<any> => {
  const { data } = await userAxiosInstance.post("/seller-request", payload);
  return data;
};

export const saveFCMtoken = async (token: string): Promise<void> => {
  await userAxiosInstance.post("/savefcm-token", { token });
};

export const carRegister = async (carDetails: CreateCarDTO): Promise<any> => {
  const { data } = await userAxiosInstance.post("/register-car", carDetails);
  return data;
};

export const carComment = async (comment: CreateCommentDto): Promise<any> => {
  const { data } = await userAxiosInstance.post("/car-comment", comment);
  return data;
};

export const getCarComments = async (carId: string): Promise<any[]> => {
  const { data } = await userAxiosInstance.get(`/car-comments/${carId}`);
  return data;
};

export const getAllBids = async (): Promise<any[]> => {
  const { data } = await userAxiosInstance.get("/bids");
  return data;
};

export const getSellerStatistics = async (): Promise<any> => {
  const { data } = await userAxiosInstance.get("/seller-statistics");
  return data.data;
};

export const getBidHistory = async (carId: string): Promise<any[]> => {
  const { data } = await userAxiosInstance.get(`/bid-history/${carId}`);
  return data;
};

export const createPost = async (post: Post): Promise<any> => {
  const { data } = await userAxiosInstance.post("/create-post", post);
  return data;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const { data } = await userAxiosInstance.get("/posts");
  return data;
};

export const addOrRemoveLike = async (postId: string): Promise<any> => {
  const { data } = await userAxiosInstance.patch(`/like/${postId}`);
  return data;
};

export const getNotifications = async (): Promise<any[]> => {
  const { data } = await userAxiosInstance.get("/notification");
  return data;
};

export const updateNotification = async (
  payload: { id?: string; all?: boolean }
): Promise<any> => {
  const { data } = await userAxiosInstance.patch("/notification", payload);
  return data;
};

export const auctionEnd = async (carId: string): Promise<any> => {
  const { data } = await userAxiosInstance.post(`/${carId}/end`);
  return data;
};

export const soldCars = async (): Promise<any[]> => {
  const { data } = await userAxiosInstance.get("/soldcars");
  return data;
};

export const wonAuction = async (): Promise<any[]> => {
  const { data } = await userAxiosInstance.get("/auction/won");
  return data;
};
