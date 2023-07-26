import { DomainError } from '../../common/domain.error';

export class AuthError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static AuthorizationHeadersNotProvided(): AuthError {
    return new AuthError(
      'AuthorizationHeadersNotProvided',
      'You have not provided authorization headers',
    );
  }

  public static InvalidAuthHeaders(): AuthError {
    return new AuthError(
      'InvalidAuthHeaders',
      'Authorization header has to be "Bearer ${token}"',
    );
  }

  public static PasswordsNotMatching(): AuthError {
    return new AuthError('PasswordsNotMatching', 'Passwords not matching');
  }

  public static AlreadyExists(): AuthError {
    return new AuthError('AlreadyExists', 'User already exists');
  }
}
