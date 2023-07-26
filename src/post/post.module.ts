import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { JwtModule } from 'src/jwt/jwt.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), JwtModule, TagModule],
  providers: [PostService, PostResolver],
  exports: [PostResolver, PostService],
})
export class PostModule {}
