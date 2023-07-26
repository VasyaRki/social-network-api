import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';
import { UserService } from 'src/user/user.service';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtTypes } from 'src/jwt/enums/jwt-types.enum';
import { EntityService } from 'src/common/entity.service';
import { PrivateMessage } from '../inputs/private-message.input';
import { ChatWithUserInput } from '../inputs/chat-with-user.input';
import { JwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { RegisterConnectionInput } from '../inputs/register-connection.input';

@Injectable()
export class ChatService extends EntityService<Message> {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private jwtService: JwtService,
  ) {
    super(messageRepository);
  }

  public async registerConnection(
    registerConnectionInput: RegisterConnectionInput,
  ): Promise<void> {
    const token = JwtAuthGuard.extractTokenFromAuthorizationHeaders(
      registerConnectionInput.authorization,
    );

    const payload: IJwtPayload = this.jwtService.verify(token, JwtTypes.Access);
    const userId = payload.id;

    this.userService.save({
      id: userId,
      socketId: registerConnectionInput.socketId,
    });
  }

  public async getChat(
    client: Socket,
    chatWithUserInput: ChatWithUserInput,
  ): Promise<void> {
    const messages = await this.getMany([
      {
        authorId: chatWithUserInput.authorId,
        userId: chatWithUserInput.userId,
      },
      {
        authorId: chatWithUserInput.userId,
        userId: chatWithUserInput.authorId,
      },
    ]);

    client.emit('privateMessage', messages);
  }

  public async sendPrivateMessage(
    privateMessage: PrivateMessage,
  ): Promise<void> {
    const { authorId, message, recipientId } = privateMessage;

    this.create({
      authorId,
      text: message,
      userId: recipientId,
    });

    privateMessage.recipientSocket.emit('privateMessage', {
      message,
      authorId,
    });
  }

  public async isUserOnline(io: Namespace, userId: number): Promise<boolean> {
    const user = await this.userService.getOne({ id: userId });
    const userSocket = await io.sockets.get(user.socketId);

    return !!userSocket;
  }
}
