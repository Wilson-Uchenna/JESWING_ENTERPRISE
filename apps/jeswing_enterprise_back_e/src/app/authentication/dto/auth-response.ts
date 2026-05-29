import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../../../generated/prisma/enums';

@ObjectType()
export class UserPayload {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => UserPayload)
  user!: UserPayload;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}