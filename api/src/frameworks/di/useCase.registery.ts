import { container } from "tsyringe";

//bcrypt imports
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";

//strategy Imports
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/Client-register.strategy";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/ClientLoginStrategy";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/AdminLoginStrategy";

//UseCase Imports
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/IRegister-usecase.interface";
import { RegisterUserUseCase } from "../../useCases/auth/register-user-usecase";
import { IGenerateOtpUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { GenerateOtpUseCase } from "../../useCases/auth/register-strategies/GenerateOtpUseCase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpUseCase } from "../../useCases/auth/register-strategies/VerifyOtp.useCase";
import { GenerateTokenUseCase } from "../../useCases/auth/GenerateTokenUseCase";
import { LoginUserUseCase } from "../../useCases/auth/LoginUserUseCase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateTokenUseCase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/ILoginUserUseCase";
import { IBlackListTokenUseCase } from "../../entities/repositoryInterfaces/auth/IBlackListTokenUseCase";
import { BlackListTokenUseCase } from "../../useCases/auth/BlackListTokenUseCase";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeRefreshTokenUseCase";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/RevokeRefreshTokenUseCase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../useCases/auth/RefreshTokenUseCase";
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/admin/IGetallCustomersUseCase";
import { getAllCustomers } from "../../useCases/admin/GetAllUserUseCase";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateCustomerStatusUseCase";
import { UpdateCustomerStatusUseCase } from "../../useCases/admin/UpdateUserStatusUseCase";
import { IGoogleAuthUseCase } from "../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { GoogleAuthUseCase } from "../../useCases/auth/GoogleAuthUseCase";
import { ForgetPasswordUseCase } from "../../useCases/auth/ForgetPasswordUseCase";
import { IForgetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IForgetPasswordUseCase";
import { ResetPasswordUseCase } from "../../useCases/auth/ResetPasswordUseCase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";
import { IUpdateProfileUseCase } from "../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { UpdateProfileUseCase } from "../../useCases/user/UpdateProfileUseCase";
import { IUpdatePasswordUseCase } from "../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";
import { UpdatePasswordUseCase } from "../../useCases/user/UpdatePasswordUseCase";
import { IAddMoneyToWalletUseCase } from "../../entities/useCaseInterfaces/wallet/IAddMoneyToWalletUseCase";
import { AddMoneyToWalletUseCase } from "../../useCases/wallet/AddMoneyToWalletUseCase";
import { IWebHookUseCase } from "../../entities/useCaseInterfaces/payment/IWebHookUseCase";
import { WebHookUseCase } from "../../useCases/payment/HandleWebHookUseCase";
import { IGetWalletDeatailsUseCase } from "../../entities/useCaseInterfaces/wallet/IGetWalletDeatailsUseCase";
import { GetWalletDeatailsUseCase } from "../../useCases/wallet/GetWalletDeatailsUseCase";
import { IGetWalletTransactionsUseCase } from "../../entities/useCaseInterfaces/transactions/IGetAllTransactionUseCase";
import { GetWalletTransactionsUseCase } from "../../useCases/transactions/GetAllWalletTransactions";
import { IsSellerUseCase } from "../../useCases/user/IsSellerUseCase";
import { IIsSellerUseCase } from "../../entities/useCaseInterfaces/user/IIsSellerUseCase";
import { ISellerRegisterUseCase } from "../../entities/useCaseInterfaces/seller/ISellerUseCase";
import { SellerRegisterUseCase } from "../../useCases/seller/SellerRegisterUseCase";
import { IGetAllSellerRequestUseCase } from "../../entities/useCaseInterfaces/seller/IGetAllSellerRequestUseCase";
import { GetAllSellerUseCase } from "../../useCases/admin/GetAllSellerRequestUseCase";
import { IUpdateSellerStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerStatusUseCase";
import { UpdateSellerStatusUseCase } from "../../useCases/seller/UpdateSellerStatusUseCase";
import { ISaveFCMTokenUseCase } from "../../entities/useCaseInterfaces/user/ISaveFcmTokenUseCase";
import { SaveFCMTokenUseCase } from "../../useCases/user/SaveFCMTokenUseCase";
import { IRevokeFCMTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeFCMTokenUseCase";
import { RevokeFCMTokenUseCase } from "../../useCases/auth/RevokeFCMTokenUseCase";
import { ICarRegisterUseCase } from "../../entities/useCaseInterfaces/car/ICarRegisterUsecase";
import { CarRegisterUseCase } from "../../useCases/car/CarRegisterUseCase";
import { IGetAllCarsUseCase } from "../../entities/useCaseInterfaces/car/IGetAllCarsUseCase";
import { GetAllCarsUseCase } from "../../useCases/car/GetAllCarsUseCase";
import { IFindSellerDetailsUseCase } from "../../entities/useCaseInterfaces/seller/IFindSellerDetails";
import { FindSellerDetailsUseCase } from "../../useCases/seller/FindSellerDetailsUseCase";
import { IUpdateCarStatus } from "../../entities/useCaseInterfaces/car/IUpdateCarStatus";
import { UpdateCarStatus } from "../../useCases/car/UpdateCarstatus";
import { IGetCarsFilterUseCase } from "../../entities/useCaseInterfaces/car/IGetCarsFilterUseCase";
import { GetCarsFilterUseCase } from "../../useCases/car/GetCarsFilterUseCase";
import { IGetCarDetailsUseCase } from "../../entities/useCaseInterfaces/car/ICarDetailsUseCase";
import { GetCarDetailsUseCase } from "../../useCases/car/CarDetailsUseCase";
import { IUpdateSellerActiveStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerActiveStatusUseCase";
import { UpdateSellerActiveStatus } from "../../useCases/seller/UpdateSelllerActiveStatusUseCase";
import { IPlaceBidUseCase } from "../../entities/useCaseInterfaces/bid/IBidUseCase";
import { PlaceBidUseCase } from "../../useCases/bid/PlaceBidUseCase";
import { ICreateCommentUseCase } from "../../entities/useCaseInterfaces/comments/ICreateCommentUseCase";
import { CreateCommentUseCase } from "../../useCases/comments/CreateCommentUseCase";
import { IGetAllCommentsAndBidsUseCase } from "../../entities/useCaseInterfaces/comments/IGetAllCommentsAndBidsUseCase";
import { GetAllCommentsAndBidUseCase } from "../../useCases/comments/GetAllCommentsAndBidsUseCase";
import { IGetConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IGetConversationUseCase";
import { GetConversationUseCase } from "../../useCases/conversation/GetConversationUseCase";
import { IGetAllConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IGetAllConversationsUseCase";
import { GetAllConversationUseCase } from "../../useCases/conversation/GetAllConversationUseCase";
import { IJoinConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IJoinConversationUseCase";
import { JoinConversationUseCase } from "../../useCases/conversation/JoinConversationUseCase";
import { ICreateMessageUseCase } from "../../entities/useCaseInterfaces/message/ICreateMessageUseCase";
import { CreateMessageUseCase } from "../../useCases/message/CreateMessageUseCase";
import { IGetAllMessagesUseCase } from "../../entities/useCaseInterfaces/message/IGetallmessagesUseCase";
import { GetAllMessagesUseCase } from "../../useCases/message/GetAllMessagesUseCase";
import { IGetAllBidsUseCase } from "../../entities/useCaseInterfaces/bid/IGetAllBidsUseCase";
import { GetAllBidsUseCase } from "../../useCases/bid/GetAllBidsUseCase";
import { IGetSellerStatisticsUseCase } from "../../entities/useCaseInterfaces/seller/ISellerStatistics";
import { GetSellerStatistics } from "../../useCases/seller/SellerStatisticsUseCase";
import { IGetBidHistoryUseCase } from "../../entities/useCaseInterfaces/bid/IGetBidHistoryUseCase";
import { getBidHistoryUseCase } from "../../useCases/bid/GetBidHistoryUseCase";
import { ICreatePostUseCase } from "../../entities/useCaseInterfaces/post/ICreatePostUseCase";
import { CreatePostUseCase } from "../../useCases/post/createPostUseCase";
import { IGetPagenatedPostsUseCase } from "../../entities/useCaseInterfaces/post/IGetPagnatedPosts";
import { getPagenatedPosts } from "../../useCases/post/getPagenatedPosts";
import { IPostLikeUseCase } from "../../entities/useCaseInterfaces/post/IAddLikeToPostUseCase";
import { AddLikeToPostUseCase } from "../../useCases/post/addLikeToPostUseCase";
import { ISendNotificationUseCase } from "../../entities/useCaseInterfaces/message/ISendNotificationUseCase";
import { SendNotificationUseCase } from "../../useCases/message/SendNotificationUseCase";
import { IGetAllNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IGetAllNotificationsUseCase";
import { GetAllNotificationUseCase } from "../../useCases/notification/GetAllNotificationUseCase";
import { IUpdateNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IUpdateNotificationUseCase";
import { UpdateNotificationUseCase } from "../../useCases/notification/UpdateNotificationUseCase,";

export class UseCaseRegistery {
  static registerUseCases(): void {
    //* ====== Register Bcrypts ====== *//
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });
    //* ====== Register UseCases ====== *//
    container.register<IPostLikeUseCase>("IPostLikeUseCase",{
      useClass:AddLikeToPostUseCase
    })
    container.register<IGetAllNotificationUseCase>("IGetAllNotificationUseCase",{
      useClass:GetAllNotificationUseCase
    })
    container.register<IUpdateNotificationUseCase>("IUpdateNotificationUseCase",{
      useClass:UpdateNotificationUseCase
    })
    container.register<ISendNotificationUseCase>("ISendNotificationUseCase",{
      useClass:SendNotificationUseCase
    })
    container.register<IGetCarDetailsUseCase>("IGetCarDetailsUseCase",{
      useClass:GetCarDetailsUseCase
    })
    container.register<IGetPagenatedPostsUseCase>("IGetPagenatedPostsUseCase",{
      useClass:getPagenatedPosts
    })
    container.register<ICreatePostUseCase>("ICreatePostUseCase",{
      useClass:CreatePostUseCase
    })
    container.register<IGetBidHistoryUseCase>("IGetBidHistoryUseCase",{
      useClass:getBidHistoryUseCase
    })
    container.register<IGetSellerStatisticsUseCase>("IGetSellerStatisticsUseCase",{
      useClass:GetSellerStatistics
    })
    container.register<IGetAllBidsUseCase>("IGetAllBidsUseCase",{
      useClass:GetAllBidsUseCase
    })
    container.register<IGetAllMessagesUseCase>("IGetAllMessagesUseCase",{
      useClass:GetAllMessagesUseCase
    })
    container.register<IJoinConversationUseCase>("IJoinConversationUseCase",{
      useClass:JoinConversationUseCase
    })
    container.register<ICreateMessageUseCase>("ICreateMessageUseCase",{
      useClass:CreateMessageUseCase
    })
    container.register<IGetAllConversationUseCase>("IGetAllConversationUseCase",{
      useClass:GetAllConversationUseCase
    })
    container.register<IGetConversationUseCase>("IGetConversationUseCase",{
      useClass:GetConversationUseCase
    })
    container.register<IGetAllCommentsAndBidsUseCase>("IGetAllCommentsAndBidsUseCase",{
      useClass:GetAllCommentsAndBidUseCase
    })
    container.register<ICreateCommentUseCase>("ICreateCommentUseCase",{
      useClass:CreateCommentUseCase
    })
    container.register<IPlaceBidUseCase>("IPlaceBidUseCase",{
      useClass:PlaceBidUseCase
    })
    container.register<IUpdateSellerActiveStatusUseCase>("IUpdateSellerActiveStatusUseCase",{
      useClass:UpdateSellerActiveStatus
    })
    container.register<ICarRegisterUseCase>("ICarRegisterUseCase",{
      useClass:CarRegisterUseCase
    })
    container.register<IGetCarsFilterUseCase>("IGetCarsFilterUseCase",{
      useClass:GetCarsFilterUseCase
    })
    container.register<IUpdateCarStatus>("IUpdateCarStatus",{
      useClass:UpdateCarStatus
    })
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });
    container.register<IFindSellerDetailsUseCase>("IFindSellerDetailsUseCase",{
      useClass:FindSellerDetailsUseCase
    })
    container.register<ISaveFCMTokenUseCase>("SaveFCMTokenUseCase",{
      useClass:SaveFCMTokenUseCase
    })
    container.register<IRevokeFCMTokenUseCase>("IRevokeFCMTokenUseCase",{
      useClass:RevokeFCMTokenUseCase
    })
    container.register<IGetAllCarsUseCase>("IGetAllCarsUseCase",{
      useClass:GetAllCarsUseCase
    })
    container.register<IUpdateSellerStatusUseCase>("IUpdateSellerStatusUseCase",{
      useClass:UpdateSellerStatusUseCase
    });
    container.register<IGetAllCustomersUseCase>("IGetAllCustomersUseCase", {
      useClass: getAllCustomers,
    });
    container.register<IGetAllSellerRequestUseCase>("IGetAllSellerRequestUseCase",{
      useClass:GetAllSellerUseCase
    });
    container.register<IGenerateOtpUseCase>("IGenerateOtpUseCase", {
      useClass: GenerateOtpUseCase,
    });
    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });
    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });
    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });
    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });
    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );
    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });
    container.register<IUpdateCustomerStatusUseCase>(
      "IUpdateCustomerStatusUseCase",
      {
        useClass: UpdateCustomerStatusUseCase,
      }
    );
    container.register<IGoogleAuthUseCase>("IGoogleAuthUseCase", {
      useClass: GoogleAuthUseCase,
    });
    container.register<IForgetPasswordUseCase>("IForgetPasswordUseCase", {
      useClass: ForgetPasswordUseCase,
    });
    container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
      useClass: ResetPasswordUseCase,
    });
    container.register<IUpdateProfileUseCase>("IUpdateProfileUseCase", {
      useClass: UpdateProfileUseCase,
    });
    container.register<IUpdatePasswordUseCase>("IUpdatePasswordUseCase", {
      useClass: UpdatePasswordUseCase,
    });
    container.register<IAddMoneyToWalletUseCase>("IAddMoneyToWalletUseCase", {
      useClass: AddMoneyToWalletUseCase,
    });
    container.register<IWebHookUseCase>("IWebHookUseCase", {
      useClass: WebHookUseCase,
    });
    container.register<IGetWalletDeatailsUseCase>("IGetWalletDeatailsUseCase", {
      useClass: GetWalletDeatailsUseCase,
    });
    container.register<IGetWalletTransactionsUseCase>(
      "IGetWalletTransactionsUseCase",
      {
        useClass: GetWalletTransactionsUseCase,
      }
    );
    container.register<IIsSellerUseCase>("IsSellerUseCase", {
      useClass: IsSellerUseCase,
    });
    container.register<ISellerRegisterUseCase>("ISellerRegisterUseCase", {
      useClass: SellerRegisterUseCase,
    });
    //* ====== Register Strategy ====== *//
    container.register("ClientRegisterStrategy", {
      useClass: ClientRegisterStrategy,
    });
    container.register("ClientLoginStrategy", {
      useClass: ClientLoginStrategy,
    });
    container.register("AdminLoginStrategy", {
      useClass: AdminLoginStrategy,
    });
  }
}
