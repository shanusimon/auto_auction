import { inject,injectable } from "tsyringe";
import { IGoogleAuthUseCase } from "../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { HTTP_STATUS, TRole } from "../../shared/constants"
import { CustomError } from "../../entities/utils/custom.error";
import { IUserEntity } from "../../entities/models/user.entity";
import { OAuth2Client } from "google-auth-library";
import { IClientEntity } from "../../entities/models/client.entity";
import { generateUniqueUid } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase{
    private oAuthClient:OAuth2Client;
    constructor(
        @inject("IClientRepository") private clientRepo:IClientRepository
    ){
        this.oAuthClient = new OAuth2Client();
    }
    async execute(credentials: any, client_id: any, role: TRole): Promise<Partial<IClientEntity>> {
        const ticket = await this.oAuthClient.verifyIdToken({
            idToken:credentials,
            audience:client_id
        });

        const payload = ticket.getPayload();

        if(!payload){
            throw new CustomError(
                "Invalid or empty token payload",
                HTTP_STATUS.UNAUTHORIZED
            );
        }
        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.given_name;
        const profileImage = payload.picture || "";

        if(!email){
            throw new CustomError("Email is required",HTTP_STATUS.BAD_REQUEST)
        }

        const existingUser = await this.clientRepo.findByEmail(email);
        if(!existingUser){
            const customerId = generateUniqueUid();
            const newUser = await this.clientRepo.save({
                password:" ",
                clientId:customerId,
                name,
                googleId,
                profileImage,
                email,
                role
            })

            if(!newUser){
                throw new CustomError("Failed to register user. Please try again later.", HTTP_STATUS.INTERNAL_SERVER_ERROR)
            }
            return newUser
        }
        return existingUser
    }
}
