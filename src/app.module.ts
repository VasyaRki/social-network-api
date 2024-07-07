import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      csrfPrevention: false,
      subscriptions: {
        'graphql-ws': {
          path: '/subscriptions',
        },
      },

      context: async (ctx) => {
        if (ctx.connectionParams) {
          return {
            req: {
              headers: { authorization: ctx.connectionParams.Authorization },
            },
          };
        }
        return ctx;
      },
    }),
    UserModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
