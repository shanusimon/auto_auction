import { updateSellerStatus } from "@/services/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../useToaster";
import { ISellerEntity } from "@/types/Types";


export interface sellerResponse {
  sellers: ISellerEntity[];
  totalPage: number;
  totalCount: number;
}

export const useUpdateSellerActiveStatus = (
  currentPage: number,
  limit: number,
  search: string
) => {
  const { successToast, errorToast } = useToaster();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerId: string) => updateSellerStatus(sellerId),

    onMutate: async (sellerId: string) => {
      const queryKey = ["sellers", currentPage, limit, search] as const;

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<sellerResponse>(queryKey);

      queryClient.setQueryData(queryKey, (oldData: sellerResponse | undefined) => {
        if (!oldData || !oldData.sellers) return oldData;

        return {
          ...oldData,
          sellers: oldData.sellers.map((seller: ISellerEntity) =>
            seller._id === sellerId
              ? { ...seller, isActive: !seller.isActive }
              : seller
          ),
        };
      });

      return { previousData, queryKey };
    },

    onSuccess: (data) => {
      successToast(data.message || "Seller status updated successfully");
    },

    onError: (error: any, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      errorToast(error.response?.data?.message || "An error occurred while updating seller status");
    },
  });
};
