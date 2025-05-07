import * as z from "zod";


export const carFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  vehicleRegion: z.string()
    .regex(/^[A-Z]{2}$/, { message: "Region must be 2 uppercase letters" }),
  vehicleNumber: z
    .string()
    .regex(/^\d{5}$/, { message: "Vehicle number must be exactly 5 digits" }),
  year: z.preprocess(
    (val) => Number(val),
    z.number()
      .int()
      .min(1900, { message: "Year must be at least 1900" })
      .max(2025, { message: "Year cannot be greater than 2025" })
  ),
  mileage: z.preprocess(
    (val) => Number(val),
    z.number()
      .nonnegative({ message: "Mileage must be a positive number" })
  ),
  reservePrice: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.union([
      z.number().nonnegative({ message: "Reserve price must be positive" }),
      z.undefined()
    ])
  ),  
  bodyType: z.string().min(3, { message: "Body type is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  description: z.string().min(30, { message: "Description must be at least 30 characters" }),
  fuel: z.string().min(1, { message: "Fuel type is required" }),
  transmission: z.string().min(1, { message: "Transmission type is required" }),
  ExteriorColor: z.string().min(1, { message: "Exterior color is required" }),
  InteriorColor: z.string().min(3, { message: "Interior color is required" }),
  auctionDuration:z.string().min(1,{message:"Auction Duration is required"})
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export interface CreateCarDTO {
  title: string;
  make: string;
  model: string;
  vehicleNumber: string;
  year: number;
  mileage: number;
  reservedPrice?: number;
  bodyType: string;
  location: string;
  description: string;
  fuel: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  auctionDuration: string;
  images: string[];
}

export enum FuelType {
  Gasoline = "gasoline",
  Diesel = "diesel",
  Electric = "electric",
  Hybrid = "hybrid",
  PluginHybrid = "plugin_hybrid",
}

export enum BodyType {
  Sedan = "Sedan",
  SUV = "SUV",
  Coupe = "Coupe",
  Convertible = "Convertible",
  Wagon = "Wagon",
  Limousine = "Limousine",
}


export interface ICarEntity{
  _id?:string;
  sellerId:string;
  title:string;
  make:string;
  model:string;
  year:number;
  mileage:number;
  reservedPrice?:number;
  bodyType:BodyType;
  location:string;
  description: string;
  fuel: FuelType;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  auctionDuration: string;
  images:string[];
  approvalStatus:"pending" | "approved" | "rejected";
}

export interface CarFilterReturn {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  imageUrl: string;
  currentBid: number;
  timeRemaining: string;
  bids: number;
  location?: string;
  noReserve?: boolean;
  specs?: string[];
}

type CommentType = {
  _id: string;
  carId: string;
  userId: { id: string; name?: string }; // adjust structure based on your real user object
  content: string;
  parentId: string | null;
  likes: any[];
  createdAt: string;
  updatedAt: string;
  type?: 'comment';
};

type BidType = {
  _id: string;
  carId: string;
  userId: { id: string; name?: string }; // adjust structure
  amount: number;
  depositHeld: number;
  timestamp: string;
  status: string;
  type?: 'bid';
};

export type CombinedItem = (CommentType | BidType) & { type: 'comment' | 'bid' };
