import { Module } from '@nestjs/common';
import { RedisPropagatorService } from '../services/RedisPropagatorService';
import { RedisModule } from './RedisModule';
import { SocketService } from '../services/SocketService';

@Module({
  imports: [RedisModule],
  providers: [RedisPropagatorService, SocketService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule {}
