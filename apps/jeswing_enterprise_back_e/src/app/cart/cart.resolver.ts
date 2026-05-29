import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { AddToCartInput } from './dto/add-to-cart.input';
import { UpdateCartInput, RemoveFromCartInput } from './dto/update-cart.input';
import { CurrentUserReq } from '../authentication/decorators/current-user.decorator';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  createCart(@CurrentUserReq() userId: string, @Args('addCartInput') addCartInput: AddToCartInput) {
    return this.cartService.addToCart(userId, addCartInput.productId, addCartInput.quantity);
  }

  

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cartService.findOne(id);
  } 

  @Mutation(() => Cart)
  updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    return this.cartService.update(updateCartInput.cartItemId, updateCartInput);
  }

  @Mutation(() => Cart)
  removeCart(@Args('removeCartInput') removeCartInput: RemoveFromCartInput) {
    return this.cartService.remove(removeCartInput.cartItemId);
  }
}
