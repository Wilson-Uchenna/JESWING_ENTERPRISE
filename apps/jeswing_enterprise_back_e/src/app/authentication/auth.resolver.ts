import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput, LoginInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import * as loginResponseDto from './dto/auth-response';

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
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }

  @Query(() => Auth)
  updateUserRole(@Args('id') )
}
