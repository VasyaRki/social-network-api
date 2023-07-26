import { Field, InputType, ObjectType } from '@nestjs/graphql';

export type PagedResult<Entity> = { data: Entity[]; total: number };

@InputType()
export class PaginationQuery {
  @Field(() => Number)
  page: number;

  @Field(() => Number)
  limit: number;
}
