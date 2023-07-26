import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Tag } from 'src/tag/tag.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Like } from '../like/like.entity';
import { Follow } from '../follow/follow.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from 'src/chat/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        username: configService.getOrThrow('DATABASE_USERNAME'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        database: configService.getOrThrow('DATABASE_NAME'),
        entities: [User, Post, Follow, Like, Comment, Message, Tag],
        synchronize: true,
      }),
    }),
  ],
})
export class DbModule {}
