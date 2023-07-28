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
import { JwtTypes } from './jwt/enums/jwt-types.enum';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { CommentModule } from './comment/comment.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtService } from './jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from './jwt/interfaces/jwt-payload.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [JwtModule],
      inject: [JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN],
      useFactory: async (jwtService: JwtService) => ({
        autoSchemaFile: true,
        introspection: true,
        playground: true,
        installSubscriptionHandlers: true,
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (connectionParam) => {
              const token = JwtAuthGuard.extractTokenFromAuthorizationHeaders(
                connectionParam.Authorization,
              );

              const payload: IJwtPayload = jwtService.verify(
                token,
                JwtTypes.Access,
              );

              return payload;
            },
          },
        },
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
  providers: [ConfigService, JwtModule],
})
export class AppModule {}
