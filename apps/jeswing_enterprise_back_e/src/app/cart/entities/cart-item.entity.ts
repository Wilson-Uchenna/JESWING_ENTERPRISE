import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class CartItem {
  @Field()
  id!: string;

  @Field()
  cartId!: string;

  @Field()
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Product)
  product!: Product;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}