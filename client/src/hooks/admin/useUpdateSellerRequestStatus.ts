import { updateSellerRequestStatus } from "@/services/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../useToaster";

export const useUpdateSellerStatus = (currentPage: number, limit: number, search: string) => {
    const { successToast, errorToast } = useToaster();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sellerId, status }: { sellerId: string; status: "approved" | "rejected" }) =>
            updateSellerRequestStatus(sellerId, status),
        onSuccess: (data) => {
            successToast(data.message); 
            queryClient.invalidateQueries({ queryKey: ["sellerRequest", currentPage, limit, search] });
        },
        onError: (error: any) => {
            errorToast(error.response?.data?.message || "An error occurred while updating seller status");
        },
    });
};
