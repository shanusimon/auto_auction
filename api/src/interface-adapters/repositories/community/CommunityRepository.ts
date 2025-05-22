import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community/ICommunityRepository";
import { CommunityModel } from "../../../frameworks/database/models/community.model";

export class CommunityRepository implements ICommunityRepository{
    constructor(){}
    async createCommunity(data: { name: string; decription: string; createdBy: string; isActive: boolean; }): Promise<void> {
        await CommunityModel.create(data);
    }
}