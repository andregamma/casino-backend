import { Module } from '@nestjs/common';
import { UserGateway } from '../gateways/UserGateway';
import { AuthModule } from '../resources/guards/auth/AuthModule';
import { NetworkGateway } from '../gateways/NetworkGateway';

import { RedisModule } from './RedisModule';
import { RedisPropagatorModule } from './RedisPropagatorModule';
import { SessionModule } from './SessionModule';
import { SocketModule } from './SocketModule';
import { UserModule } from './UserModule';
import { BlackjackModule } from './BlackjackModule';
import { ChatModule } from './ChatModule';
import { MatchesModule } from './MatchesModule';
import { BetsModule } from './BetsModule';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    SocketModule,
    RedisPropagatorModule,
    SessionModule,
    UserModule,
    BlackjackModule,
    ChatModule,
    MatchesModule,
    BetsModule,
  ],
  exports: [RedisModule, SocketModule],
  controllers: [],
  providers: [NetworkGateway],
})
export class Modules {}
