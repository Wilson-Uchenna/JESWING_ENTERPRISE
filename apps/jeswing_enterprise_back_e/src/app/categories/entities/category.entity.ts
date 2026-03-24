import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field()
  deletedAt!: Date;
}
