export interface SellerDetails {
    approvalStatus: string;
}

export interface IsSellerResponse {
    isSeller: boolean;
    sellerDetails: SellerDetails | null;
    isActive: boolean;
}

export interface IIsSellerUseCase {
    execute(id: string): Promise<IsSellerResponse>;
}
