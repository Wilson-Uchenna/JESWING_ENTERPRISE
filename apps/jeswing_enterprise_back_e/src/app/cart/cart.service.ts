import { Injectable } from '@nestjs/common';
import { UpdateCartInput } from './dto/update-cart.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      return this.update(existingItem.id, {
        cartItemId: existingItem.id,
        quantity: existingItem.quantity + quantity,
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  
  }
  

  async findOne(id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart;
  }

  async update(id: string, updateCartInput: UpdateCartInput) {
   const existingCart = await this.prisma.cart.findUnique({
      where: { id },
    });

    if (!existingCart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    return this.prisma.cartItem.update({
      where: { id: updateCartInput.cartItemId },
      data: { quantity: updateCartInput.quantity },
    });
  }

  async remove(id: string) {
    const existingCart = await this.prisma.cart.findUnique({
      where: { id },
    });

    if (!existingCart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    return this.prisma.cartItem.delete({
      where: { id },
    });
  }
}
