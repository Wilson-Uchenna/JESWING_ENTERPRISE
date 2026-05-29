import { AddToCartInput } from './add-to-cart.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput extends PartialType(AddToCartInput) {
  @Field()
  cartItemId!: string;

  @Field(() => Int)
  override quantity!: number;
}

@InputType()
export class RemoveFromCartInput {
  @Field()
  cartItemId!: string;
}
