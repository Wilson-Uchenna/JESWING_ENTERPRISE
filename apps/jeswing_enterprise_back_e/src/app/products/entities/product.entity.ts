import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { Category } from '../../categories/entities/category.entity';

@ObjectType()
export class Product {
   @Field(() => ID)    // ✅ should be ID or String, not Int
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  image!: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field()
  stripePriceId!: string;

  @Field(() => Boolean)
  isFeatured!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  deletedAt!: Date;
}
