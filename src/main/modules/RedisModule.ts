import { Module } from '@nestjs/common';
import { redisProviders } from '../providers/RedisProvider/RedisProvider';
import { RedisService } from '../services/RedisService';
import { SocketService } from '../services/SocketService';

@Module({
  imports: [SocketService],
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
