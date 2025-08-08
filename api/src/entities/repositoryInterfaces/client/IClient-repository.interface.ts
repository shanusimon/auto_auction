import { IClientEntity } from "../../models/client.entity";
import { ClientProfileResponse } from "../../../shared/dtos/user.dto";

export interface IClientRepository {
  findById(id: any): Promise<IClientEntity | null>;
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ users: IClientEntity[] | []; total: number }>;
  save(data: Partial<IClientEntity>): Promise<IClientEntity>;
  findCount(): Promise<Number>;
  findByEmail(email: string): Promise<IClientEntity | null>;

  findByIdAndUpdateStatus(id: string): Promise<void>;
  findAndUpdateByEmail(
    email: string,
    updates: Partial<IClientEntity>
  ): Promise<IClientEntity | null>;
  updateProfileById(
    id: string,
    data: Partial<IClientEntity>
  ): Promise<ClientProfileResponse>;
  findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<void>;
  findBySearchTerm(searchTerm: string): Promise<String[]>;
  updateFcmToken(id: string, fcmToken: string): Promise<void>;
  revokeFcmToken(id: string): Promise<void>;
}
