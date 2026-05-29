import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field()
  productId!: string;

  @Field()
  quantity!: number;

  
  
}
