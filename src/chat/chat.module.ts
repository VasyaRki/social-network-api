import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';
import { ChatService } from './services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule, JwtModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
