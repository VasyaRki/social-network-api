import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';

@ObjectType()
export class UserEntityResponse {
  @Field(() => Int)
  readonly id: number;

  @Field(() => String)
  readonly email?: string;

  @Field(() => String)
  readonly phone?: string;

  @Field(() => String)
  readonly username: string;

  @Field(() => String)
  readonly firstName: string;

  @Field(() => String)
  readonly lastName: string;

  @Field(() => String)
  readonly role: UserRoleEnum;

  @Field(() => String)
  readonly authProvider: AuthProviderEnum;
}
