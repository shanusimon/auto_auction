import { Schema, Types, model, Document } from 'mongoose';
import { IAdminWallet } from '../../../entities/models/admin.wallet.entity';

const TransactionSchema = new Schema({
  transactionId: { type: String, required: true },
  userName: { type: String, required: true },
  auctionId: { type: Types.ObjectId, ref: 'AuctionWon', required: true },
  carId: { type: Types.ObjectId, ref: 'Car', required: true },
  amountReceived: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  timeStamp: { type: Date, default: Date.now },
});

export const AdminWalletSchema = new Schema<IAdminWallet & Document>(
  {
    balanceAmount: { type: Number, required: true, default: 0 },
    transaction: { type: [TransactionSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default model<IAdminWallet & Document>('AdminWallet', AdminWalletSchema);