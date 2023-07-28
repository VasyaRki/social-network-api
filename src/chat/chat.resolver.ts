import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Subscription, Args, Query } from '@nestjs/graphql';
import { Message } from './message.entity';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessageDataInput } from './inputs/message-data.input';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';

const pubSub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  public async getChatHistoryByUserId(
    @Args('userId') userId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<Message[]> {
    return this.chatService.getChatHistoryByUserId({
      userId,
      authorId: jwtPayload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  public async sendPrivateMessage(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('messageDataInput') messageDataInput: MessageDataInput,
  ): Promise<Message> {
    const message = await this.chatService.create({
      authorId: jwtPayload.id,
      text: messageDataInput.message,
      userId: messageDataInput.recipientId,
    });

    pubSub.publish('privateMessage', {
      privateMessage: { ...message },
    });

    return message;
  }

  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      return payload.privateMessage.userId === context.id;
    },
  })
  privateMessage() {
    return pubSub.asyncIterator('privateMessage');
  }
}
