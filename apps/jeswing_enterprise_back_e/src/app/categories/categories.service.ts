import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryInput: CreateCategoryInput) {
  const slug = slugify(createCategoryInput.name, {
    lower: true,
    strict: true,
  });

  const existing = await this.prisma.category.findFirst({ where: { slug } });
  if (existing)
    throw new ConflictException('Category with this name already exists');

  return this.prisma.category.create({
    data: {
      ...createCategoryInput,
      slug,
    },
  });
}

  async findAll() {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  async findBySlug(slug: string) {
  const category = await this.prisma.category.findFirst({
    where: { slug },
    include: { products: true },
  });

  if (!category) throw new NotFoundException('Category not found');

  return category;
}

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
  const category = await this.prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return this.prisma.category.update({
    where: { id },
    data: updateCategoryInput,
  });
}

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
