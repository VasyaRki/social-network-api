import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { DomainError } from 'src/common/domain.error';
import { AuthError } from 'src/auth/errors/auth.error';
import { JwtTypes } from 'src/jwt/enums/jwt-types.enum';
import { JwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authorizationHeaders = request.handshake.headers.authorization;

      const accessToken =
        JwtAuthGuard.extractTokenFromAuthorizationHeaders(authorizationHeaders);

      const payload: IJwtPayload = this.jwtService.verify(
        accessToken,
        JwtTypes.Access,
      );

      return true;
    } catch (err) {
      if (err instanceof DomainError) {
        throw new UnauthorizedException(err.message);
      }

      throw new BadRequestException(err.message);
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
