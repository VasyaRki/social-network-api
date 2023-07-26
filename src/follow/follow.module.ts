import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), JwtModule],
  providers: [FollowResolver, FollowService],
  exports: [FollowResolver, FollowService],
})
export class FollowModule {}
