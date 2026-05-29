import { InputType, Field } from '@nestjs/graphql';
import { IsString,  MinLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsString()
  @Field(() => String)
  name!: string;

  @IsString()
  @Field(() => String)
  @MinLength(10)
  description!: string;
}

