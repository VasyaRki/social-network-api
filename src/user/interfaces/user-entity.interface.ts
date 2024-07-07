import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';

export interface IUserEntity {
  readonly id: number;

  readonly email?: string;

  readonly phone?: string;

  readonly hashedPassword?: string;

  readonly username: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly role: UserRoleEnum;

  readonly authProvider: AuthProviderEnum;
}
