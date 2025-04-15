import { model } from 'mongoose';
import { ICarEntity } from '../../../entities/models/car.entity';
import { carSchema } from '../schemas/car.schema';

export const CarModel = model<ICarEntity>('Car', carSchema);
