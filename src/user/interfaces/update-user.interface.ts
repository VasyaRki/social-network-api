export interface IUpdateUser {
  readonly email?: string;

  readonly phone?: string;

  readonly username?: string;

  readonly lastName?: string;

  readonly firstName?: string;

  readonly hashedPassword?: string;
}
