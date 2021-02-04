import { Module } from '@nestjs/common';
import { AuthModule } from '../resources/guards/auth/AuthModule';
import { NetworkGateway } from '../gateways/NetworkGateway';

import { RedisModule } from './RedisModule';
import { RedisPropagatorModule } from './RedisPropagatorModule';
import { SessionModule } from './SessionModule';
import { SocketModule } from './SocketModule';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    SocketModule,
    RedisPropagatorModule,
    SessionModule,
  ],
  exports: [RedisModule, SocketModule],
  controllers: [],
  providers: [NetworkGateway],
})
export class Modules {}
