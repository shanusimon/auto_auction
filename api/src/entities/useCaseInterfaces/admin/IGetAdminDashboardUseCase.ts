
export type TransactionHistory = {
  transactionId: string;
  userName: string;
  carDetails: {
    make: string;
    model: string;
    year: number;
  };
  amountReceived: number;
  commissionAmount: number;
  time: Date;
};

export interface IGetAdminDashBoardUseCase {
 execute(): Promise<{
    walletBalance: number;
    CustomersCount: number;
    approvedSellers: number;
    carRegistered: number;
    transactionHistory: TransactionHistory[];
    stats: { name: string; value: number; count: number }[];
  }>
}
