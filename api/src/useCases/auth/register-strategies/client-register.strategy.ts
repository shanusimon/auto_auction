import { inject,injectable } from "tsyringe";
import { IRegisterStrategy } from "./register-strategy.interface";
import { UserDTO } from "../../../shared/dtos/user.dto";
import { IClientRepository } from "../../../entities/useCaseInterfaces/client/client-repository.interface";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IUserEntity } from "../../../entities/models/user.entity";
import { generateUniqueUid } from "../../../frameworks/security/uniqueuid.bcrypt";
import { CustomError } from "../../../entities/utils/custom.error";

@injectable()
export class ClientRegisterStrategy implements IRegisterStrategy{
    constructor(
        @inject("IClientRepository") private clientRepository:IClientRepository,
        @inject("IPasswordBcrypt") private passwordBcrypt:IBcrypt
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

        const {name,email,phoneNumber,password} = user as UserDTO

        let hashedPassword = null;
        if(password){
            hashedPassword = await this.passwordBcrypt.hash(password);
        }
        const clientId = generateUniqueUid("user")

        return await this.clientRepository.save({
            name,
            email,
            password:hashedPassword ?? "",
            phone:phoneNumber,
            clientId,
            role:"user"
        })
    }
    
}