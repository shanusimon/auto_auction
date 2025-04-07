export interface ISellerEntity {
  _id?: string;
  userId: IUser;
  userName: string; 
  userEmail: string; 
  userPhone: string; 
  isSeller: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  address: string;
  identificationNumber: string;
  isProfessionalDealer: boolean;
  businessDetails?: {
    businessName?: string;
    licenseNumber?: string;
    taxID?: string;
    website?: string;
    yearsInBusiness?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}


interface IUser {
  clientId: string;
  name: string;
  email: string;
  phone: string;

}
export interface SellerRequestTableProps {
  sellerRequests: ISellerEntity[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isPending:boolean
}

export interface FetchCustomerParams {
    page:number,
    limit:number,
    search:string
}

