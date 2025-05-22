import { userAxiosInstance } from "@/api/clientAxios";
import { ChangePasswordData } from "@/hooks/user/userDashboard";
import { CreateCarDTO } from "@/types/CarFormTypes";
import {
  CreateCommentDto,
  SellerRequestPayload,
  WalletTransactionsResponse,
} from "@/types/Types";
import { CarFilterReturn } from "@/types/CarFormTypes";
import { Post } from "@/types/Post.Types";

export const logoutUser = async () => {
  const response = await userAxiosInstance.post("/_us/user/logout");
  return response.data;
};

export const carDetails = async (carId:string)=>{
  const response = await userAxiosInstance.get(`/_us/user/car/${carId}`);
  return response.data
}

export const getCars = async (
  year?: number,
  transmission?: string,
  bodyType?: string,
  fuel?: string,
  sort: string = 'ending-soon',
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

  const response = await userAxiosInstance.get(`/_us/user/cars?${queryParams}`);
  return response.data.data; 
};


export const changePassword = async (data: ChangePasswordData) => {
  const response = await userAxiosInstance.patch(
    "/_us/user/change-password",
    data
  );
  console.log("changePassword response", response);
  return response.data;
};

export const getAllTransaction = async (
  page: number = 1,
  limit: number = 6
): Promise<WalletTransactionsResponse> => {
  const response = await userAxiosInstance.get("/_us/user/getAllTransaction", {
    params: { page, limit },
  });
  return response.data.data;
};

export const getWalletBalance = async () => {
  const response = await userAxiosInstance.get("/_us/user/getWalletBalance");
  return response.data;
};

export const getIsSeller = async () => {
  const repsonse = await userAxiosInstance.get("/_us/user/seller-status");
  return repsonse.data;
};

export const getSellerRequest = async (data: SellerRequestPayload) => {
  const response = await userAxiosInstance.post(
    "/_us/user/seller-request",
    data
  );
  return response.data;
};

export const saveFCMtoken = async (token: string) => {
  const response = await userAxiosInstance.post("/_us/user/savefcm-token", {
    token,
  });
  return response.data;
};

export const carRegister = async (carDetails: CreateCarDTO) => {
  const response = await userAxiosInstance.post("/_us/user/register-car", carDetails);
  return response.data;
};

export const carComment = async (comment:CreateCommentDto) => {
  const response = await userAxiosInstance.post("/_us/user/car-comment",comment);
  return response.data
}

export const getCarComments = async(carId:string)=>{
  const response = await userAxiosInstance.get(`/_us/user/car-comments/${carId}`);
  return response.data
}

export const getAllBids = async()=>{
  const response = await userAxiosInstance.get(`/_us/user/bids`);
  return response.data
}

export const getSellerStatistics = async()=>{
  const response = await userAxiosInstance.get(`/_us/user/seller-statistics`);
  return response.data
}

export const getBidHistory = async(carId:string)=>{
  const response = await userAxiosInstance.get(`/_us/user/bid-history/${carId}`);
  return response.data
}

export const createPost = async(post:Post)=>{
  const response = await userAxiosInstance.post(`/_us/user/create-post`,post);
  return response.data
}

export const getAllposts = async()=>{
  const response = await userAxiosInstance.get(`/_us/user/posts`);
  return response.data
}

export const addOrRemoveLike = async (postId: string) => {
  const response = await userAxiosInstance.patch(`/_us/user/like/${postId}`);
  return response.data;
};

export const getNotifications = async()=>{
  const response = await userAxiosInstance.get(`/_us/user/notification`);
  return response.data
}

export const updateNotification = async (payload:{id?:string,all?:boolean})=>{
  const response = await userAxiosInstance.patch(`/_us/user/notification`,payload);
  return response.data
}