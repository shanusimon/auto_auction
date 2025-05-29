import { model } from "mongoose";
import { IAdminWallet } from "../../../entities/models/admin.wallet.entity";
import { AdminWalletSchema } from "../schemas/admin.wallet.schema";

export const AdminWalletModel = model<IAdminWallet>("AdminWallet", AdminWalletSchema);
