import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../authentication/guards/roles.guard';

@Module({
  providers: [CategoriesResolver, CategoriesService, PrismaService, RolesGuard],
})
export class CategoriesModule {}
