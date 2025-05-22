import { ICreatePostUseCase } from "../../entities/useCaseInterfaces/post/ICreatePostUseCase";
import { CreatePostDTO } from "../../shared/dtos/post.dto";
import { IPostRepository } from "../../entities/repositoryInterfaces/post/IPostRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(
    @inject("IPostRepository") private postRepository: IPostRepository
  ) {}
  async execute(data: CreatePostDTO, userId: string): Promise<void> {
    if (!data.description && !data.media) {
      throw new Error("Post must have either a description or media");
    }

    await this.postRepository.create(
      userId,
      data.description,
      data.media,
      data.mediaType
    );
  }
}
