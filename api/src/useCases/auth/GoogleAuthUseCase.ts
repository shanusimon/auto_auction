import { inject, injectable } from "tsyringe";
import { IGoogleAuthUseCase } from "../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";
import { OAuth2Client } from "google-auth-library";
import { IClientEntity } from "../../entities/models/client.entity";
import { generateUniqueUid } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
    private oAuthClient: OAuth2Client;
    
    constructor(
        @inject("IClientRepository") private clientRepo: IClientRepository,
        @inject("IWalletRepository") private walletRepository: IWalletRepository
    ){
        this.oAuthClient = new OAuth2Client();
    }
    
    async execute(credentials: any, client_id: any, role: TRole): Promise<Partial<IClientEntity>> {
        const ticket = await this.oAuthClient.verifyIdToken({
            idToken: credentials,
            audience: client_id
        });
        
        const payload = ticket.getPayload();
        
        if (!payload) {
            throw new CustomError(
                "Invalid or empty token payload",
                HTTP_STATUS.UNAUTHORIZED
            );
        }
        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.given_name;
        const profileImage = payload.picture || "";
        
        if (!email) {
            throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
        }
        
        const existingUser = await this.clientRepo.findByEmail(email);
        
        if (!existingUser) {

            let wallet = null;
            try {
                wallet = await this.walletRepository.create({
                    userId: null,
                    balance: 0
                });
            } catch (error) {
                throw new CustomError("Failed to create wallet", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            
            const customerId = generateUniqueUid();
            let newUser;
            
            try {
                newUser = await this.clientRepo.save({
                    password: " ", 
                    clientId: customerId,
                    name,
                    googleId,
                    profileImage,
                    email,
                    role,
                    walletId: wallet._id
                });
                

                await this.walletRepository.update(wallet._id, {
                    userId: newUser.id
                });

            } catch (error) {
                if (wallet && wallet._id) {
                    console.log(`Rolling back: Deleting wallet ${wallet._id}`);
                    await this.walletRepository.delete(wallet._id);
                }
                throw new CustomError(
                    "Failed to register user. Please try again later.",
                    HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
            }
            
            return newUser;
        }
        return existingUser;
    }
}
