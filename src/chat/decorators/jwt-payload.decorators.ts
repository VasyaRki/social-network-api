import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPipe } from 'src/jwt/pipes/jwt.pipe';

export const GetAuhtorizationHeaders = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.handshake.headers.authorization;
  },
);

export const IJwtPayloadDecorator = () => GetAuhtorizationHeaders(JwtPipe);
