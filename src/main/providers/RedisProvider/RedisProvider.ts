import { Provider } from '@nestjs/common';
import IoredisAux from 'ioredis-aux';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './RedisConstants';

export const redisProviders: Provider[] = [
  {
    useFactory: (): IoredisAux => {
      return new IoredisAux({
        host: process.env.REDIS_HOST,
        port: Number.parseInt(process.env.REDIS_PORT, 10),
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): IoredisAux => {
      return new IoredisAux({
        host: process.env.REDIS_HOST,
        port: Number.parseInt(process.env.REDIS_PORT, 10),
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
