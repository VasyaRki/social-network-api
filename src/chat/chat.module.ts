import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  exports: [ChatResolver],
  providers: [ChatService, ChatResolver],
  imports: [TypeOrmModule.forFeature([Message]), JwtModule],
})
export class ChatModule {}
