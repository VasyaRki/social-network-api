import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Follow } from 'src/follow/follow.entity';
import { TagService } from 'src/tag/tag.service';
import { EntityService } from '../common/entity.service';
import { CreatePostInput } from './inputs/create-post.input';
import { PaginationQuery } from 'src/common/types/pagination-query.type';

@Injectable()
export class PostService extends EntityService<Post> {
  constructor(
    private tagService: TagService,
    @InjectRepository(Post) private service: Repository<Post>,
  ) {
    super(service);
  }

  public async deletePost(postId: number, userId: number): Promise<boolean> {
    const post = await super.getOne({ id: postId });
    if (post.userId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return super.delete(postId);
  }

  public async getFeedPosts(
    authorId: number,
    paginationQuery?: PaginationQuery,
  ): Promise<Post[]> {
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 20;

    const feedPosts = await this.service
      .createQueryBuilder('post')
      .innerJoinAndSelect(
        Follow,
        'follow',
        'post.userId = follow.userId AND follow.authorId = :authorId',
        { authorId },
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return feedPosts;
  }

  public async createPost(
    authorId: number,
    createPostInput: CreatePostInput,
  ): Promise<Post> {
    const tags = [];

    for (const name of createPostInput.tags) {
      let tag = await this.tagService.getOne({ name });
      if (!tag) {
        tag = await this.tagService.create({ name });
      }
      tags.push(tag);
    }

    const post = await this.create({
      userId: authorId,
      title: createPostInput.title,
      content: createPostInput.content,
      tags,
    });

    return post;
  }
}
