import { inject,injectable } from "tsyringe";
import { IRegisterStrategy } from "./register-strategy.interface";
import { UserDTO } from "../../../shared/dtos/user.dto";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IUserEntity } from "../../../entities/models/user.entity";
import { generateUniqueUid } from "../../../frameworks/security/uniqueuid.bcrypt";
import { CustomError } from "../../../entities/utils/custom.error";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IWallet } from "../../../entities/models/wallet.entity";
import { IClientBaseRepository } from "../../../entities/repositoryInterfaces/client/IClientBaseRepository";

@injectable()
export class ClientRegisterStrategy implements IRegisterStrategy{
    constructor(
        @inject("IClientRepository") private clientRepository:IClientRepository,
        @inject("IPasswordBcrypt") private passwordBcrypt:IBcrypt,
        @inject("IWalletRepository") private walletRepository:IWalletRepository,
        @inject("IClientBaseRepository") private clientBaseRepository:IClientBaseRepository
    ){}

    async register(user: UserDTO): Promise<IUserEntity | void> {
        const existingClient = await this.clientRepository.findByEmail(
            user.email
        );

        if(existingClient){
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_EXISTS,
                HTTP_STATUS.CONFLICT
            )
        }

        const {name,email,phone,password} = user as UserDTO

        let hashedPassword = null;
        if(password){
            hashedPassword = await this.passwordBcrypt.hash(password);
        }
        const clientId = generateUniqueUid("user");

        let wallet :IWallet | null = null;
        
        try {
            wallet = await this.walletRepository.create({
                userId:null,
                availableBalance:0,
                reservedBalance:0
            })

            const newUser = await this.clientBaseRepository.save({
                name,
                email,
                password:hashedPassword ?? "",
                phone,
                clientId,
                role:"user",
                walletId:wallet._id
            })

            await this.walletRepository.update(wallet._id,{
                userId:newUser.id
            })
            
            return newUser
        } catch (error) {
            if(wallet && wallet._id){
                console.log(`Rolling back: Deleting wallet ${wallet._id}`);
                await this.walletRepository.delete(wallet._id);
            }
            throw new CustomError(
                ERROR_MESSAGES.SERVER_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }
    }
    
}