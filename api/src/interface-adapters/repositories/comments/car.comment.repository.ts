import { ICarCommentsEntity } from "../../../entities/models/car.comments.entity";
import { ICarCommentRepository } from "../../../entities/repositoryInterfaces/comments/ICarCommentRepository";
import { CarCommentModel } from "../../../frameworks/database/models/car.comment.model";


export class CarCommentRepository implements ICarCommentRepository{
    constructor(){}
    async create(data: { carId: string; userId: string; content: string; parentId?: string | null; }): Promise<void> {
        await CarCommentModel.create(data)
    }
    async findAllByCarId(carId: string): Promise<ICarCommentsEntity[]> {
        const data = await CarCommentModel.find({ carId }).populate('userId','name profileImage').lean()
      
        return data.map(comment => ({
          ...comment,
          carId: comment.carId.toString(),
          userId: comment.userId,
          _id: comment._id.toString(),
          parentId: comment.parentId ? comment.parentId.toString() : null,
          likes: comment.likes?.map((id: any) => id.toString()) || [],
        }));
      }
}