// src/usecases/admin/getAdminDashboadUseCase.ts
import { inject, injectable } from 'tsyringe';
import {
  IGetAdminDashBoardUseCase,
  TransactionHistory,
} from '../../entities/useCaseInterfaces/admin/IGetAdminDashboardUseCase';
import { IAdminWalletRepository } from '../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository';
import { IClientRepository } from '../../entities/repositoryInterfaces/client/IClient-repository.interface';
import { ISellerRepository } from '../../entities/repositoryInterfaces/seller/ISellerRepository';
import { ICarRepository } from '../../entities/repositoryInterfaces/car/ICarRepository';
import { AuctionWonRepositoryInterface } from '../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface';
import { CustomError } from '../../entities/utils/custom.error';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../shared/constants';
import { ICarBaseRepository } from '../../entities/repositoryInterfaces/car/ICarBaseRepository';
import { ISellerBaseRepository } from '../../entities/repositoryInterfaces/seller/ISellerBaseRepository';
import { IClientBaseRepository } from "../../entities/repositoryInterfaces/client/IClientBaseRepository";

@injectable()
export class getAdminDashboadUseCase implements IGetAdminDashBoardUseCase {
  constructor(
    @inject('IAdminWalletRepository') private adminWalletRepository: IAdminWalletRepository,
    @inject('IClientRepository') private clientRepository: IClientRepository,
    @inject('ISellerRepository') private sellerRepository: ISellerRepository,
    @inject('ICarRepository') private carRepository: ICarRepository,
    @inject("AuctionWonRepositoryInterface") private auctionWonRepository:AuctionWonRepositoryInterface,
    @inject("ICarBaseRepository") private carBaseRepository:ICarBaseRepository,
    @inject("ISellerBaseRepository") private sellerBaseRespository:ISellerBaseRepository,
        @inject("IClientBaseRepository")
    private clientBaseRepository: IClientBaseRepository
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

    const CustomersCount = Number(await this.clientBaseRepository.findCount());
    const approvedSellers = Number(await this.sellerBaseRespository.count({}));
    const carRegistered = Number(await this.carBaseRepository.count({}));

    const transactionHistory: TransactionHistory[] = [];
    if (wallet?.transaction?.length) {
      for (const tx of wallet.transaction) {
        const auciton = await this.auctionWonRepository.findByIdWithoutCarPopulation(tx.auctionId.toString());
        if(!auciton?.carId){
          throw new CustomError(
            ERROR_MESSAGES.CAR_NOT_FOUND,
            HTTP_STATUS.BAD_REQUEST
          )
        }
        const car = await this.carBaseRepository.findById(auciton.carId.toString());
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