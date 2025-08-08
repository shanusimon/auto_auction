//module import
import { container } from "tsyringe";

//respoitory imports
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ClientRepository } from "../../interface-adapters/repositories/client/client.repository";
import { IUserExistenceService } from "../../entities/services/Iuser-existence-service.interface";
import { UserExistenceService } from "../../interface-adapters/services/UserExistenceService";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { RedisClient } from "../redis/redisClient";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/IRefreshToken-RepositoryInterface";
import { RefreshTokenRepository } from "../../interface-adapters/repositories/auth/refreshTokenRepository";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { RedisTokenRepository } from "../../interface-adapters/repositories/redis/RedisTokenRepository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { WalletRepository } from "../../interface-adapters/repositories/wallet/wallet.repository";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { WalletTransactionRepository } from "../../interface-adapters/repositories/wallet-transaction/wallet.transaction.repository";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { SellerRepository } from "../../interface-adapters/repositories/seller/seller.repository";
import { CarRepository } from "../../interface-adapters/repositories/car/car.repository";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/IBidRepository";
import { BidRepository } from "../../interface-adapters/repositories/bid/bid.repository";
import { ICarCommentRepository } from "../../entities/repositoryInterfaces/comments/ICarCommentRepository";
import { CarCommentRepository } from "../../interface-adapters/repositories/comments/car.comment.repository";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";
import { ConversationRepository } from "../../interface-adapters/repositories/conversation/conversation.repository";
import { IMessageRepository } from "../../entities/repositoryInterfaces/message/IMessageRepository";
import { MessageRepository } from "../../interface-adapters/repositories/message/messaage.repository";
import { IPostRepository } from "../../entities/repositoryInterfaces/post/IPostRepository";
import { PostRepository } from "../../interface-adapters/repositories/post/post.repository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { NotificationRepository } from "../../interface-adapters/repositories/notification/notification.repository";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { AuctionWonRepository } from "../../interface-adapters/repositories/auctionwon/AuctionWonRepository";
import { IAdminWalletRepository } from "../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository";
import { adminWalletRepository } from "../../interface-adapters/repositories/adminWallet/adminWalletRepository";
//service imports
import { IOtpService } from "../../entities/services/IOtpService";
import { OtpService } from "../../interface-adapters/services/OtpService";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { NodemailerService } from "../../interface-adapters/services/NodemailerService";
import { JWTService } from "../../interface-adapters/services/JwtTokenService";
import { ITokenService } from "../../entities/services/ITokenService";
import { StripeService } from "../../interface-adapters/services/StripeService";
import { IPaymentService } from "../../entities/services/IStripeService";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });
    container.register<AuctionWonRepositoryInterface>("AuctionWonRepositoryInterface",{
      useClass:AuctionWonRepository
    })
    container.register<IAdminWalletRepository>("IAdminWalletRepository",{
      useClass:adminWalletRepository
    })
    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });
    container.register<ICarRepository>("ICarRepository", {
      useClass: CarRepository,
    });
    container.register<IMessageRepository>("IMessageRepository",{
      useClass:MessageRepository
    })
    container.register<INotificationRepository>("INotificationRepository",{
      useClass:NotificationRepository
    })
    container.register<IPostRepository>("IPostRepository",{
      useClass:PostRepository
    })
    container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
      useClass: RefreshTokenRepository,
    });
    container.register<IBidRepository>("IBidRepository", {
      useClass: BidRepository,
    });
    container.register<IWalletRepository>("IWalletRepository", {
      useClass: WalletRepository,
    });
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });
    container.register<IConversationRepository>("IConversationRepository",{
      useClass:ConversationRepository
    })
    container.register<INodemailerService>("INodemailerService", {
      useClass: NodemailerService,
    });
    container.register<IRedisClient>("IRedisClient", {
      useClass: RedisClient,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });
    container.register<IWalletTransactionRepository>(
      "IWalletTransactionRepository",
      {
        useClass: WalletTransactionRepository,
      }
    );
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });
    container.register<IRedisTokenRepository>("IRedisTokenRepository", {
      useClass: RedisTokenRepository,
    });
    container.register<IPaymentService>("IPaymentService", {
      useClass: StripeService,
    });
    container.register<ISellerRepository>("ISellerRepository", {
      useClass: SellerRepository,
    });
    container.register<ICarCommentRepository>("ICarCommentRepository", {
      useClass: CarCommentRepository,
    });
  }
}
