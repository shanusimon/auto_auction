import { BodyType, FuelType, TransmissionType } from '../../shared/types/car.types';

export interface CreateCarDTO {
    title: string;
    make: string;
    model: string;
    vehicleNumber: string;
    year: number;
    mileage: number;
    reservedPrice?: number;
    bodyType: BodyType;
    location: string;
    description: string;
    carNumber:string;
    fuel: FuelType;
    transmission: TransmissionType;
    exteriorColor: string;
    interiorColor: string;
    auctionDuration: string;
    images:string[];
  }


  export type carDTO = CreateCarDTO & {
    sellerId:string;
    approvalStatus: 'pending' 
  }

  export interface ICarFilter{
    year?:number | string,
    transmission?:TransmissionType,
    bodyType?:BodyType,
    fuel?:FuelType,
    sort?:"ending-soon" | "newly-listed" | "no-reserve" 
  }
