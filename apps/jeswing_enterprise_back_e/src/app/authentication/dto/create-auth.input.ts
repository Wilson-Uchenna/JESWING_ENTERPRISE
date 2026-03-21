import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @IsString()
  @Field(() => String)
  firstName!: string;

  @IsString()
  @Field(() => String)
  lastName!: string;

  @IsEmail()
  @Field(() => String)
  email!: string;

  @IsString()
  @MinLength(6)
  @Field(() => String)
  password!: string
}

@InputType()
export class LoginInput {
  @IsEmail()
  @Field(() => String)
  email!: string;

  @IsString()
  @MinLength(6)
  @Field(() => String)
  password!: string;
}

@InputType()
export class RefreshTokenInput {
  @IsString()
  @Field(() => String)
  refreshToken!: string;
}
