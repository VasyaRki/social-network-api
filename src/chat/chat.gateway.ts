import {
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChatService } from './services/chat.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessageDataInput } from './inputs/message-data.input';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from './decorators/jwt-payload.decorators';
import { GlobalExceptionFilter } from 'src/common/global-exception-filter';

@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'message',
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() io: Namespace;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    const authorization = client.handshake.headers.authorization;
    this.chatService.registerConnection({
      authorization,
      socketId: client.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getChatByUserId')
  public async getAllMessages(
    @MessageBody() data,
    @ConnectedSocket() client: Socket,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ) {
    this.chatService.getChat(client, {
      userId: data.userId,
      authorId: jwtPayload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendPrivateMessage')
  public async sendPrivateMessage(
    @ConnectedSocket() client: Socket,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @MessageBody() messageDataInput: MessageDataInput,
  ) {
    const recipient = await this.userService.getOne({
      id: messageDataInput.recipientId,
    });

    const recipientSocket = this.io.sockets.get(recipient.socketId);

    this.chatService.sendPrivateMessage({
      recipientSocket,
      authorId: jwtPayload.id,
      message: messageDataInput.message,
      recipientId: messageDataInput.recipientId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('isUserOnline')
  public async isUserOnline(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const isOnline = await this.chatService.isUserOnline(this.io, data.id);
    client.emit('isUserOnline', isOnline);
  }
}
