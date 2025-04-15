import { BodyType, FuelType } from '../../shared/types/car.types';

export interface CreateCarDTO {
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    reservedPrice?: number;
    bodyType: BodyType;
    location: string;
    description: string;
    fuel: FuelType;
    transmission: string;
    exteriorColor: string;
    interiorColor: string;
    auctionDuration: string;
    images:string[];
  }


  export type carDTO = CreateCarDTO & {
    sellerId:string;
    approvalStatus: 'pending' 
  }