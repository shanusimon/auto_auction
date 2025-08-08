import { inject,injectable } from "tsyringe";
import { PagenateCustomers } from "../../entities/models/pageinated-users.entity";
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/admin/IGetallCustomersUseCase";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";

@injectable()
export class getAllCustomers implements IGetAllCustomersUseCase{
    constructor(
        @inject("IClientRepository") private clientRepository:IClientRepository,
    ){}

    async execute(pageNumber: number, pageSize: number, searchTerm: string): Promise<PagenateCustomers> {
        let filter:any = {};

        if(searchTerm){
            filter.$or = [
                {name:{$regex:searchTerm,$options:"i"}},
                {email:{$regex:searchTerm,$options:"i"}}
            ]
        }
        const validPageNumber = Math.max(1,pageNumber || 1);
        const validPageSize = Math.max(1,pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize

        const {users,total}= await this.clientRepository.find(filter,skip,limit);

        const response :PagenateCustomers = {
            users,
            total:Math.ceil(total / validPageSize)
        }
        return response
    }
}