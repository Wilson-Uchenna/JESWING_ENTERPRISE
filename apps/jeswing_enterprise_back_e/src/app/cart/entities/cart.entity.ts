import { ObjectType, Field } from '@nestjs/graphql';
import { CartItem } from './cart-item.entity';

@ObjectType()
export class Cart {
   @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field(() => [CartItem])
  items!: CartItem[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
  
