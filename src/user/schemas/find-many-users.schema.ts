import { Field, InputType, Int } from '@nestjs/graphql';
import { CONSTANTS } from '../../common/domain.constants';

@InputType()
export class FindManyUsersSchema {
  @Field(() => String, { nullable: true })
  readonly search?: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: CONSTANTS.DOMAIN.PAGINATION.LIMIT,
  })
  readonly limit: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: CONSTANTS.DOMAIN.PAGINATION.OFFSET,
  })
  readonly offset: number;
}
