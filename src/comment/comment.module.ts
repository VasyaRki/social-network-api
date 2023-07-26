import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), JwtModule],
  providers: [CommentService, CommentResolver],
  exports: [CommentResolver, CommentService],
})
export class CommentModule {}
