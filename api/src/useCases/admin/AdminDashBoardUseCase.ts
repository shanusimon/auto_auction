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

@injectable()
export class getAdminDashboadUseCase implements IGetAdminDashBoardUseCase {
  constructor(
    @inject('IAdminWalletRepository') private _adminWalletRepository: IAdminWalletRepository,
    @inject('IClientRepository') private _clientRepository: IClientRepository,
    @inject('ISellerRepository') private _sellerRepository: ISellerRepository,
    @inject('ICarRepository') private _carRepository: ICarRepository,
    @inject("AuctionWonRepositoryInterface") private _auctionWonRepository:AuctionWonRepositoryInterface,
  ) {}

  async execute(): Promise<{
    walletBalance: number;
    CustomersCount: number;
    approvedSellers: number;
    carRegistered: number;
    transactionHistory: TransactionHistory[];
    stats: { name: string; value: number; count: number }[];
  }> {
    const wallet = await this._adminWalletRepository.findSingle();
    const walletBalance = wallet?.balanceAmount || 0;

    const CustomersCount = Number(await this._clientRepository.findCount());
    const approvedSellers = Number(await this._sellerRepository.count({}));
    const carRegistered = Number(await this._carRepository.countDocuments({}));

    const transactionHistory: TransactionHistory[] = [];
    if (wallet?.transaction?.length) {
      for (const tx of wallet.transaction) {
        const auciton = await this._auctionWonRepository.findByIdWithoutCarPopulation(tx.auctionId.toString());
        if(!auciton?.carId){
          throw new CustomError(
            ERROR_MESSAGES.CAR_NOT_FOUND,
            HTTP_STATUS.BAD_REQUEST
          )
        }
        const car = await this._carRepository.findOne({_id:auciton.carId.toString()});
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

    const stats = await this._carRepository.auctionAnalytics();

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