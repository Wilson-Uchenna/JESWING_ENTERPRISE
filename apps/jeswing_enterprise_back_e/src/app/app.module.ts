import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './authentication/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 makes env available everywhere without re-importing
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'apps/jeswing_enterprise_back_e/dist/schema.gql',
      ),
    }),
    ProductsModule,
    AuthModule,
    CategoriesModule,
    CartModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
