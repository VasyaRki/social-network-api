import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSchema {
  @Field(() => String, { nullable: true })
  readonly email?: string;

  @Field(() => String, { nullable: true })
  readonly phone?: string;

  @Field(() => String, { nullable: true })
  readonly username?: string;

  @Field(() => String, { nullable: true })
  readonly firstName?: string;

  @Field(() => String, { nullable: true })
  readonly lastName?: string;
}
