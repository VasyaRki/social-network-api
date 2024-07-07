import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntityResponse } from './user-entity.response';

@ObjectType()
export class FindManyUsersResponse {
  @Field(() => [UserEntityResponse])
  public readonly users: UserEntityResponse[];

  @Field(() => Int)
  public readonly count: number;

  constructor(rows, count) {
    this.count = count;
    this.users = rows;
  }
}
