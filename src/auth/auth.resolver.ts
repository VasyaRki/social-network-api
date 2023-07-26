import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './responses/auth.responce';
import { UserLoginInput } from './inputs/login-user.input';
import { UserRegistrationInput } from './inputs/register-user.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(userLoginInput);
  }

  @Mutation(() => AuthResponse)
  signup(
    @Args('userRegistrationInput') userRegistrationInput: UserRegistrationInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(userRegistrationInput);
  }

  @Mutation(() => AuthResponse)
  refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
