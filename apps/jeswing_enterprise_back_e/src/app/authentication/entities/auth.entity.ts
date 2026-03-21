import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../../../generated/prisma/enums'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user',
});

@ObjectType()
export class Auth {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => UserRole)
  role!: UserRole;
}