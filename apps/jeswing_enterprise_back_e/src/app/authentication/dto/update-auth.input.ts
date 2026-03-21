import { CreateAuthInput } from './create-auth.input';
import { InputType, PartialType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  @Field(() => String)
  @IsUUID()
  id!: string;
}