import { registerEnumType } from '@nestjs/graphql';
import { UserRoleEnum } from '../user/enums/user-role.enum';
import { AuthProviderEnum } from '../user/enums/auth-provider.enum';

export function registrationEnumForGraphQL(): void {
  registerEnumType(UserRoleEnum, {
    name: 'UserRoleEnum',
  });

  registerEnumType(AuthProviderEnum, {
    name: 'AuthProviderEnum',
  });
}
