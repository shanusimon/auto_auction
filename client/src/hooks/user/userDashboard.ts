import { useMutation,useQuery } from "@tanstack/react-query";
import { changePassword, getAllTransaction, getWalletBalance } from "@/services/user/userServices";
import { AxiosResponse } from "@/services/auth/authServices";
import { AddMoneyData, addMoneyToWallet } from "@/services/payment/paymentServices"; 
import { WalletBalanceResponse, WalletTransactionsResponse } from "@/types/Types";

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
    return useMutation<AddMoneyToWalletResponse,Error,AddMoneyData>({
        mutationFn:addMoneyToWallet,
        onError:(error)=>{
            console.error("Error adding money to wallet:",error)
        }
    })
};

export const useGetWalletTransaction  = (page:number=1,limit:number=6)=>{
    return useQuery<WalletTransactionsResponse>({
        queryKey:['walletTransactions',page,limit],
        queryFn:()=>getAllTransaction(page,limit),
        placeholderData:(prevdata) => prevdata ? {...prevdata} : undefined,
        retry: 2, 
    })
}

export const useGetWalletBalance = () => {
    return useQuery<WalletBalanceResponse>({
        queryKey: ['walletBalance'],
        queryFn: async () => {
            const balance = await getWalletBalance();
            console.log('Fetched wallet balance:', balance);
            return balance;
        },
        retry: 2,
        staleTime: 0, 
    })
};