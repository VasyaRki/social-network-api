import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentInput } from './inputs/comment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  public async commentPostByPostId(
    @Args('commentInput') commentInput: CommentInput,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<Comment> {
    return this.commentService.create({
      authorId: jwtPayload.id,
      ...commentInput,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async deleteComment(
    @Args('commentId') commentId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    return this.commentService.deleteComment({
      authorId: jwtPayload.id,
      commentId,
    });
  }

  @Query(() => [Comment])
  public async getCommentByPostId(
    @Args('postId') postId: number,
  ): Promise<Comment[]> {
    return this.commentService.getMany({ postId }, ['like']);
  }

  @ResolveField(() => Boolean)
  public async isLiked(
    @Parent() comment: Comment,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ) {
    const authorId = jwtPayload.id;
    const commentLikes = comment.like || [];

    return commentLikes.some((like) => like.authorId === authorId);
  }
}
