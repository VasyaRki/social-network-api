import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthError } from '../errors/auth.error';
import { JWT_CONSTANTS } from '../../jwt/jwt.constants';
import { JwtService } from '../../jwt/interfaces/jwt-service.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class SetAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    const { userLoginInput } = args;

    try {
      const payload = await this.authService.login({
        email: userLoginInput.email,
        password: userLoginInput.password,
      });

      const gqlContext = ctx.getContext();
      gqlContext.req.res.cookie('accessToken', payload.accessToken);
      gqlContext.req.res.cookie('refreshToken', payload.refreshToken);

      return true;
    } catch (error) {
      return false;
    }
  }

  public static extractTokenFromAuthorizationHeaders(
    authorizationHeaders: string,
  ): string {
    if (!authorizationHeaders) {
      throw AuthError.AuthorizationHeadersNotProvided();
    }

    const tokenType = authorizationHeaders.split(' ')[0];
    const token = authorizationHeaders.split(' ')[1];

    if (tokenType !== 'Bearer' || !token) {
      throw AuthError.InvalidAuthHeaders();
    }

    return token;
  }
}
