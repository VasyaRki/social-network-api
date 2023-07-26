import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Query,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { TagService } from 'src/tag/tag.service';
import { CreatePostInput } from './inputs/create-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { PaginationQuery } from '../common/types/pagination-query.type';
import { GetPostsByFilterInput } from './inputs/get-posts-by-filter.input';
import { PaginatedPostsResponce } from './responses/paginated-posts.response';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private tagService: TagService,
    private postService: PostService,
  ) {}

  @Query(() => Post)
  public async getPostById(@Args('id') id: number): Promise<Post> {
    return this.postService.getOne({ id }, ['comment', 'user', 'like']);
  }

  @Query(() => PaginatedPostsResponce)
  public async getPostsByFilter(
    @Args('getPostsInput', { nullable: true })
    getPostsInput: GetPostsByFilterInput,
  ): Promise<PaginatedPostsResponce> {
    return this.postService.paginate(
      getPostsInput?.paginationQuery,
      getPostsInput?.filter,
      ['comment', 'user', 'like', 'tags'],
    );
  }

  @Query(() => [Post])
  public async getPostsByTag(@Args('tag') tag: string): Promise<Post[]> {
    return this.tagService.getPostsByTag(tag);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  public async getFeedPosts(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('paginationQuery', { nullable: true })
    paginationQuery: PaginationQuery,
  ): Promise<Post[]> {
    return this.postService.getFeedPosts(jwtPayload.id, paginationQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  public async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<Post> {
    return this.postService.createPost(jwtPayload.id, createPostInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async deletePost(
    @Args('postId') postId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    return this.postService.deletePost(postId, jwtPayload.id);
  }

  @ResolveField(() => Boolean)
  public async isLiked(
    @Parent() post: Post,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    const authorId = jwtPayload.id;
    const postLikes = post.like || [];

    return postLikes.some((like) => like.authorId === authorId);
  }
}
