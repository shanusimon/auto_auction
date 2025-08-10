import { adminAxiosInstance } from "@/api/axios";

export const logoutAdmin = async () => {
  const response = await adminAxiosInstance.post("/logout");
  return response.data;
};

export const updateCarStatus = async (
  carId: string,
  data: {
    status: "approved" | "rejected";
    rejectionReason?: string;
    sellerEmail: string;
  }
) => {
  const response = await adminAxiosInstance.patch(`/updateCarStatus/${carId}`, data);
  return response.data;
};

export const getAllCarRequests = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await adminAxiosInstance.get("/get-allCarRequests", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getSellerDetails = async (sellerId: string) => {
  const response = await adminAxiosInstance.get(`/seller-details/${sellerId}`);
  return response.data;
};

export const getAllCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await adminAxiosInstance.get("/get-allusers", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getAllSellerDetails = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await adminAxiosInstance.get("/seller", {
    params: { page, limit, search },
  });
  return response.data;
};

export const updateSellerStatus = async (sellerId: string) => {
  try {
    const response = await adminAxiosInstance.patch(`/seller-status/${sellerId}`, {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

export const updateStatus = async (userId: string) => {
  try {
    const response = await adminAxiosInstance.patch(`/customer-status/${userId}`, {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

export const getAllSellerRequest = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await adminAxiosInstance.get("/get-allSellerRequests", {
    params: { page, limit, search },
  });
  return response.data;
};

export const updateSellerRequestStatus = async (
  userId: string,
  status: string,
  reason?: string
) => {
  try {
    const payload: any = { status };
    if (status === "rejected" && reason) {
      payload.reason = reason;
    }

    const response = await adminAxiosInstance.patch(
      `/sellerRequest-update/${userId}`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

export interface RevenueData {
  name: string;
  revenue: number;
}

export const getDashBoardRevenue = async (
  period: "weekly" | "monthly" | "yearly"
): Promise<RevenueData[]> => {
  try {
    const response = await adminAxiosInstance.get(`/revenue?period=${period}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch revenue data");
  }
};

export const getDashBoardDetails = async () => {
  try {
    const resposne = await adminAxiosInstance.get(`/dashboard`);
    return resposne.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch revenue data");
  }
};
