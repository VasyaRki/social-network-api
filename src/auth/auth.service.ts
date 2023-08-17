import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { AuthError } from './errors/auth.error';
import { UserService } from '../user/user.service';
import { JWT_CONSTANTS } from '../jwt/jwt.constants';
import { JwtTypes } from '../jwt/enums/jwt-types.enum';
import { Provider } from '../user/enums/provider.enum';
import { AuthResponse } from './responses/auth.responce';
import { CACHE_CONSTANTS } from '../cache/cache.constants';
import { GoogleAuthInput } from './inputs/google-auth.input';
import { ILoginUser } from './interfaces/login-user.interface';
import { IRegisterUser } from './interfaces/register-user.interface';
import { JwtService } from '../jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { ICacheService } from '../cache/interfaces/cache-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cacheService: ICacheService,
  ) {}

  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getOne({ email: username });

    if (!user) {
      throw AuthError.DoesNotExists();
    }

    if (!user.isEmailConfirmed) {
      throw AuthError.EmailNotConfirmed();
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw AuthError.PasswordsNotMatching();
    }

    return user;
  }

  public async login(userLoginInput: ILoginUser): Promise<AuthResponse> {
    const { email, password } = userLoginInput;
    const user = await this.validateUser(email, password);

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    this.userService.save({
      id: user.id,
      refreshToken: jwtPair.refreshToken,
    });

    return {
      ...jwtPair,
      user,
    };
  }

  public async signup(userRegisterInput: IRegisterUser): Promise<AuthResponse> {
    const candidate = await this.userService.getOne({
      email: userRegisterInput.email,
    });

    if (candidate) {
      throw AuthError.AlreadyExists();
    }

    const hashedPassword = await bcrypt.hash(userRegisterInput.password, 10);

    const user = await this.userService.create({
      ...userRegisterInput,
      password: hashedPassword,
      isEmailConfirmed: true,
    });

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    return {
      ...jwtPair,
      user,
    };
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const payload: IJwtPayload = this.jwtService.verify(
      refreshToken,
      JwtTypes.Refresh,
    );
    const userId = payload.id;

    const user = await this.userService.getOne({ id: userId });

    if (!user || user.refreshToken !== refreshToken) {
      throw AuthError.InvalidAuthHeaders();
    }

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    return {
      ...jwtPair,
      user,
    };
  }

  public async googleAuth(
    googleAuthInput: GoogleAuthInput,
  ): Promise<AuthResponse> {
    const email = googleAuthInput?.email;
    const token = googleAuthInput?.accessToken;

    const isValidToken = await this.verifyGoogleToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    let user = await this.userService.getOne({ email });

    if (!user) {
      const username = googleAuthInput?.firstName;
      user = await this.userService.create({
        email,
        username,
        provider: Provider.GOOGLE,
      });
    }

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    this.userService.save({
      id: user.id,
      refreshToken: jwtPair.refreshToken,
    });

    return {
      user,
      ...jwtPair,
    };
  }

  private async verifyGoogleToken(token: string): Promise<boolean> {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      );

      if (
        googleResponse.data &&
        googleResponse.data.aud ===
          this.configService.get<string>('GOOGLE_CLIENT_ID')
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
