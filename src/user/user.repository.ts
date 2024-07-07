import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IFindUser } from './interfaces/find-user.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUserEntity } from './interfaces/user-entity.interface';
import { IFindManyUser } from './interfaces/find-many-user.interface';
import { TransactionService } from '../common/transaction/transaction.service';
import { IEntityWihtCount } from '../common/interfaces/entity-with-count.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    private readonly transactionService: TransactionService,
  ) {}

  public async findOneById(userId: number): Promise<IUserEntity | null> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;
    const repository = manager.getRepository(UserEntity);

    return repository.findOneBy({ id: userId });
  }

  public async findOne(options: IFindUser): Promise<IUserEntity | null> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;
    const repository = manager.getRepository(UserEntity);

    return repository.findOneBy(options);
  }

  public async findMany(
    options: IFindManyUser,
  ): Promise<IEntityWihtCount<IUserEntity>> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;

    const repository = manager.getRepository(UserEntity);

    const queryBuilder = repository.createQueryBuilder('user');

    if (options.search) {
      queryBuilder.where('user.firstName LIKE :search', {
        search: `%${options.search}%`,
      });

      queryBuilder.where('user.lastName LIKE :search', {
        search: `%${options.search}%`,
      });

      queryBuilder.where('user.username LIKE :search', {
        search: `%${options.search}%`,
      });
    }

    if (options.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options.offset) {
      queryBuilder.offset(options.offset);
    }

    const [rows, count] = await queryBuilder.getManyAndCount();

    console.log(rows);

    return { rows, count };
  }

  public async save(options: ICreateUser): Promise<IUserEntity> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;
    const repository = manager.getRepository(UserEntity);

    return repository.save(options);
  }

  public async update(
    userId: number,
    options: Partial<IUserEntity>,
  ): Promise<void> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;
    const repository = manager.getRepository(UserEntity);

    await repository.update(userId, options);
  }

  public async delete(userId: number): Promise<void> {
    const manager =
      this.transactionService.getQueryRunner()?.manager || this.manager;
    const repository = manager.getRepository(UserEntity);

    await repository.delete(userId);
  }
}
