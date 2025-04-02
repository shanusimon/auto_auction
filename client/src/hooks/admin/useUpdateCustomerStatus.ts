import { updateStatus } from "@/services/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../useToaster";
import { IClient } from "@/types/Types";
import { customerResponse } from "./useAllUsers";

export const useUpdateCustomerStatus = (currentPage: number, limit: number, search: string) => {
    const { successToast, errorToast } = useToaster();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (customerId: string) => updateStatus(customerId),
        onMutate: async (customerId: string) => {
            const queryKey = ["customers", currentPage, limit, search] as const;
            await queryClient.cancelQueries({ queryKey });

            const previousData = queryClient.getQueryData<customerResponse>(queryKey);

            queryClient.setQueryData(queryKey, (oldData: customerResponse | undefined) => {
                if (!oldData || !oldData.users) return oldData;

                return {
                    ...oldData,
                    users: oldData.users.map((customer: IClient) =>
                        customer._id === customerId ? { ...customer, isBlocked: !customer.isBlocked } : customer
                    )
                };
            });

            return { previousData, queryKey };
        },
        onSuccess: (data) => {
            successToast(data.message);
        },
        onError: (error: any, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(context.queryKey, context.previousData);
            }
            errorToast(error.response?.data?.message || "An error occurred");
        }
    });
};
