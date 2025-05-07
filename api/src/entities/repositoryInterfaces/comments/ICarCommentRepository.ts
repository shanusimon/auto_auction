import { ICarCommentsEntity } from "../../models/car.comments.entity";

export interface ICarCommentRepository {
    create(data: {
      carId: string;
      userId: string;
      content: string;
      parentId?: string | null;
    }): Promise<void>;
    findAllByCarId(carId:string):Promise<ICarCommentsEntity[] | []>
  }
  