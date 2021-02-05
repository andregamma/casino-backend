import { Module } from '@nestjs/common';
import { UserGateway } from 'main/gateways/UserGateway';
import { AuthModule } from '../resources/guards/auth/AuthModule';
import { NetworkGateway } from '../gateways/NetworkGateway';

import { RedisModule } from './RedisModule';
import { RedisPropagatorModule } from './RedisPropagatorModule';
import { SessionModule } from './SessionModule';
import { SocketModule } from './SocketModule';
import { UserModule } from './UserModule';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    SocketModule,
    RedisPropagatorModule,
    SessionModule,
    UserModule,
  ],
  exports: [RedisModule, SocketModule],
  controllers: [],
  providers: [NetworkGateway],
})
export class Modules {}
