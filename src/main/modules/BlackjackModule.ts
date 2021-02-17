import { Module } from '@nestjs/common';
import { BlackjackGateway } from '../gateways/BlackjackGateway';
import { RedisModule } from './RedisModule';
import { RedisPropagatorModule } from './RedisPropagatorModule';
import { RoomModule } from './RoomModule';
import { SessionModule } from './SessionModule';
import { SocketModule } from './SocketModule';
import { UserModule } from './UserModule';

@Module({
  imports: [
    UserModule,
    RoomModule,
    RedisModule,
    SocketModule,
    RedisPropagatorModule,
  ],
  controllers: [],
  providers: [BlackjackGateway],
})
export class BlackjackModule {}
