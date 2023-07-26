import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), JwtModule],
  providers: [LikeService, LikeResolver],
  exports: [LikeResolver, LikeService],
})
export class LikeModule {}
