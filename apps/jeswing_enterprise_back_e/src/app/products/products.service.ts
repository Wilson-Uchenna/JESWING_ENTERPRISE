import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService
  ) {
    
  }
   async create(createProductInput: CreateProductInput) {
    const { categoryId, ...rest } = createProductInput;

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    return this.prisma.product.create({
      data: {
        ...rest,
        category: {
          connect: { id: categoryId },
        },
      },
      include: { category: true },
    });
  }
  
  findAll() {
    return this.prisma.product.findMany()
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  update(id: string, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

 async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
