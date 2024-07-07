import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';
import { IUserEntity } from '../interfaces/user-entity.interface';

@Entity('user')
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  readonly email?: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  readonly phone?: string;

  @Column({ type: 'varchar', nullable: true })
  readonly hashedPassword?: string;

  @Column({ type: 'varchar', unique: true })
  readonly username: string;

  @Column({ type: 'varchar' })
  readonly firstName: string;

  @Column({ type: 'varchar' })
  readonly lastName: string;

  @Column({ type: 'enum', enum: UserRoleEnum })
  readonly role: UserRoleEnum;

  @Column({ type: 'enum', enum: AuthProviderEnum })
  readonly authProvider: AuthProviderEnum;
}
