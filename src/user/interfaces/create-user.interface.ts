import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';

export interface ICreateUser {
  readonly email?: string;

  readonly phone?: string;

  readonly username: string;

  readonly lastName: string;

  readonly firstName: string;

  readonly role: UserRoleEnum;

  readonly hashedPassword: string;

  readonly authProvider: AuthProviderEnum;
}
