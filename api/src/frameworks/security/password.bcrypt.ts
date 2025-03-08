import { inject, injectable } from "tsyringe";
import { IBcrypt } from "./bcrypt.interface";
import bcrypt from "bcrypt";
import { config } from "../../shared/config";


@injectable()
export class PasswordBcrypt implements IBcrypt{
    async hash(original: string): Promise<string> {
        return bcrypt.hash(original,config.bcryptSaltRounds);
    }
    async compare(current: string, orginal: string): Promise<boolean> {
        return bcrypt.compare(current,orginal)
    }
}