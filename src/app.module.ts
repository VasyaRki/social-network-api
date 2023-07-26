import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DbModule } from './db/db.module';
import { TagModule } from './tag/tag.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { ChatModule } from './chat/chat.module';
import { FollowModule } from './follow/follow.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [],
      useFactory: async () => ({
        autoSchemaFile: true,
      }),
    }),
    DbModule,
    JwtModule,
    TagModule,
    AuthModule,
    UserModule,
    PostModule,
    ChatModule,
    LikeModule,
    FollowModule,
    CommentModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
