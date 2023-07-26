import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';

@Resolver()
export class FollowResolver {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Follow)
  public async follow(
    @Args('userId') userId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<Follow> {
    return this.followService.create({ authorId: jwtPayload.id, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async unfollow(
    @Args('userId') userId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ) {
    return this.followService.unfollow({ authorId: jwtPayload.id, userId });
  }

  @Query(() => [Follow])
  public async getFollowerByUserId(
    @Args('userId') userId: number,
  ): Promise<Follow[]> {
    return this.followService.getMany({ userId }, ['author']);
  }

  @Query(() => [Follow])
  public async getFollowingByUserId(
    @Args('userId') userId: number,
  ): Promise<Follow[]> {
    return this.followService.getMany({ authorId: userId }, ['user']);
  }
}
