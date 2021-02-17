import { Module } from '@nestjs/common';
import { ChatGateway } from '../gateways/ChatGateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatModule {}
