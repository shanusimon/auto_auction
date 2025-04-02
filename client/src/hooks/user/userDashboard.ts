import { useMutation,useQuery } from "@tanstack/react-query";
import { changePassword, getAllTransaction, getWalletBalance } from "@/services/user/userServices";
import { AxiosResponse } from "@/services/auth/authServices";
import { AddMoneyData, addMoneyToWallet } from "@/services/payment/paymentServices"; 
import { WalletBalanceResponse, WalletTransactionsResponse } from "@/types/Types";
import { useQueryClient } from "@tanstack/react-query";

export interface ChangePasswordData { 
    currPass: string;
    newPass: string;
}

export interface AddMoneyToWalletResponse {
    clientSecret: string; 
}

export const useUserChangePassword = () => {
    return useMutation<AxiosResponse, Error, ChangePasswordData>({
        mutationFn: changePassword,
    });
};

export const useAddMoneyToWallet = () => {
    const queryClient = useQueryClient(); // Get the query client instance

    return useMutation<AddMoneyToWalletResponse, Error, AddMoneyData>({
        mutationFn: addMoneyToWallet,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<WalletBalanceResponse>(['walletBalance'], (oldData) => {
                if (!oldData) return { balance: variables.amount }; 
                return { ...oldData, balance: oldData.balance + variables.amount }; 
            });
        },
        onError: (error) => {
            console.error('Error adding money to wallet:', error);
        },
    });
};

export const useGetWalletTransaction  = (page:number=1,limit:number=6)=>{
    return useQuery<WalletTransactionsResponse>({
        queryKey:['walletTransactions',page,limit],
        queryFn:()=>getAllTransaction(page,limit),
        placeholderData:(prevdata) => prevdata ? {...prevdata} : undefined,
        retry: 2, 
        staleTime: 5 * 60 * 1000
    })
}

export const useGetWalletBalance = ()=>{
    return useQuery<WalletBalanceResponse>({
        queryKey:['walletBalance'],
        queryFn:()=>getWalletBalance(),
        retry:2,
        staleTime:5*60*1000
    })
}