import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput, LoginInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import * as loginResponseDto from './dto/auth-response';
import { UserRole } from '../../generated/prisma/enums';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserReq,
} from './decorators/current-user.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => loginResponseDto.LoginResponse)
  createAuth(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
  ): Promise<loginResponseDto.LoginResponse> {
    return this.authService.register(createAuthInput);
  }

  @Mutation(() => loginResponseDto.LoginResponse)
  login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<loginResponseDto.LoginResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: string) {
    return this.authService.remove(id);
  }

    @Mutation(() => Auth)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateUserRole(
      @Args('id') userId: string,
      @Args('role', { type: () => UserRole }) role: UserRole,
    ): Promise<Auth> {
      return this.authService.updateUserRole(userId, role); // p
    }

  @Query(() => Auth)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUserReq() currentUser: { id: string }): Promise<Auth> {
    return await this.authService.me(currentUser.id);
  }
}
