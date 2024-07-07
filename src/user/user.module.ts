import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { TransactionService } from '../common/transaction/transaction.service';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserResolver, UserRepository, TransactionService],
})
export class UserModule {}
