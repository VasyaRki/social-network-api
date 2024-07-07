import { Injectable, OnModuleInit } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, QueryRunner } from 'typeorm';
import { TRANSACTION_CONSTANTS } from './transaction.constants';

@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly asyncLocalStorage = new AsyncLocalStorage<
    Map<string, any>
  >();

  constructor(private readonly dataSource: DataSource) {}

  public onModuleInit() {
    this.asyncLocalStorage.run(new Map(), () => {});
  }

  public async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    this.asyncLocalStorage
      .getStore()
      .set(TRANSACTION_CONSTANTS.QUERY_RUNNER, queryRunner);
  }

  public async commitTransaction() {
    const store = this.asyncLocalStorage.getStore();
    const queryRunner: QueryRunner = store.get(
      TRANSACTION_CONSTANTS.QUERY_RUNNER,
    );

    if (queryRunner) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      store.delete(TRANSACTION_CONSTANTS.QUERY_RUNNER);
    }
  }

  public async rollbackTransaction() {
    const store = this.asyncLocalStorage.getStore();

    const queryRunner: QueryRunner = store.get(
      TRANSACTION_CONSTANTS.QUERY_RUNNER,
    );

    if (queryRunner) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      store.delete(TRANSACTION_CONSTANTS.QUERY_RUNNER);
    }
  }

  public getQueryRunner(): QueryRunner {
    const store = this.asyncLocalStorage.getStore();

    if (!store) {
      return;
    }

    return store.get(TRANSACTION_CONSTANTS.QUERY_RUNNER);
  }
}
