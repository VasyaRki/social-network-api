import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserSchema } from './schemas/update-user.schema';
import { IUserEntity } from './interfaces/user-entity.interface';
import { DeleteUserResponse } from './responses/delete-user.response';
import { UserEntityResponse } from './responses/user-entity.response';
import { FindManyUsersSchema } from './schemas/find-many-users.schema';
import { FindManyUsersResponse } from './responses/find-many-users.response';
import { IEntityWihtCount } from '../common/interfaces/entity-with-count.interface';

@Resolver(() => UserEntityResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntityResponse, { name: 'findOneUserById' })
  public async findOneById(
    @Args('userId') userId: number,
  ): Promise<UserEntityResponse> {
    return this.userService.findOneById(userId);
  }

  @Query(() => FindManyUsersResponse, { name: 'findManyUsers' })
  public async findMany(
    @Args('schema') schema: FindManyUsersSchema,
  ): Promise<FindManyUsersResponse> {
    const payload: IEntityWihtCount<IUserEntity> =
      await this.userService.findMany(schema);

    return new FindManyUsersResponse(payload.rows, payload.count);
  }

  @Mutation(() => UserEntityResponse, { name: 'updateUser' })
  public async update(
    @Args('id') id: number,
    @Args('schema') schema: UpdateUserSchema,
  ): Promise<UserEntityResponse> {
    await this.userService.update(id, schema);

    return this.userService.findOneById(id);
  }

  @Mutation(() => DeleteUserResponse, { name: 'deleteUser' })
  public async delete(
    @Args('userId') userId: number,
  ): Promise<DeleteUserResponse> {
    return this.userService.delete(userId);
  }
}
