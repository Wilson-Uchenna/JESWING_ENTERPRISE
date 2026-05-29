import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  description!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price!: number;

  @Field()
  @IsString()
  image!: string;

  @Field()
  @IsString()
  stripePriceId!: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @Field()
  @IsString()
  categoryId!: string;
}