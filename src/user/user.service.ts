import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IFindUser } from './interfaces/find-user.interface';
import { IUserEntity } from './interfaces/user-entity.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { IDeleteUser } from './interfaces/delete-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { IFindManyUser } from './interfaces/find-many-user.interface';
import { IEntityWihtCount } from '../common/interfaces/entity-with-count.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findOneById(userId: number): Promise<IUserEntity | null> {
    return this.userRepository.findOneById(userId);
  }

  public async findOne(options: IFindUser): Promise<IUserEntity | null> {
    return this.userRepository.findOne(options);
  }

  public async findMany(
    options: IFindManyUser,
  ): Promise<IEntityWihtCount<IUserEntity>> {
    return this.userRepository.findMany(options);
  }

  public async create(options: ICreateUser): Promise<IUserEntity> {
    return this.userRepository.save(options);
  }

  public async update(userId: number, options: IUpdateUser): Promise<void> {
    await this.userRepository.update(userId, options);
  }

  public async delete(userId: number): Promise<IDeleteUser> {
    try {
      await this.userRepository.delete(userId);

      return { deleted: true };
    } catch (error) {
      return { deleted: false };
    }
  }
}
