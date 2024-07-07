import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteUserResponse {
  @Field(() => Boolean)
  public readonly deleted: boolean;
}
