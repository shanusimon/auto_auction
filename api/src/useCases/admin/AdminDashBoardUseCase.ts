// src/usecases/admin/getAdminDashboadUseCase.ts
import { inject, injectable } from 'tsyringe';
import {
  IGetAdminDashBoardUseCase,
  TransactionHistory,
} from '../../entities/useCaseInterfaces/admin/IGetAdminDashboardUseCase';
import { IAdminWalletRepository } from '../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository';
import { IClientRepository } from '../../entities/repositoryInterfaces/client/IClient-repository.interface';
import { ISellerRepository } from '../../entities/repositoryInterfaces/seller/sellerRepository';
import { ICarRepository } from '../../entities/repositoryInterfaces/car/carRepository';

@injectable()
export class getAdminDashboadUseCase implements IGetAdminDashBoardUseCase {
  constructor(
    @inject('IAdminWalletRepository') private adminWalletRepository: IAdminWalletRepository,
    @inject('IClientRepository') private clientRepository: IClientRepository,
    @inject('ISellerRepository') private sellerRepository: ISellerRepository,
    @inject('ICarRepository') private carRepository: ICarRepository
  ) {}

  async execute(): Promise<{
    walletBalance: number;
    CustomersCount: number;
    approvedSellers: number;
    carRegistered: number;
    transactionHistory: TransactionHistory[];
    stats: { name: string; value: number; count: number }[];
  }> {
    const wallet = await this.adminWalletRepository.findSingle();
    const walletBalance = wallet?.balanceAmount || 0;

    const CustomersCount = Number(await this.clientRepository.findCount());
    const approvedSellers = Number(await this.sellerRepository.count({}));
    const carRegistered = Number(await this.carRepository.count({}));

    const transactionHistory: TransactionHistory[] = [];
    if (wallet?.transaction?.length) {
      for (const tx of wallet.transaction) {
        const car = await this.carRepository.findById(tx.carId.toString());
        transactionHistory.push({
          transactionId: tx.transactionId,
          userName: tx.userName,
          carDetails: {
            make: car?.make || 'Unknown',
            model: car?.model || 'Unknown',
            year: car?.year || 0,
          },
          amountReceived: tx.amountReceived,
          commissionAmount: tx.commissionAmount,
          time: tx.timeStamp,
        });
      }
    }

    const stats = await this.carRepository.auctionAnalytics();

    return {
      walletBalance,
      CustomersCount,
      approvedSellers,
      carRegistered,
      transactionHistory,
      stats,
    };
  }
}