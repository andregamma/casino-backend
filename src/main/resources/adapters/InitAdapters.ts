import { INestApplication } from '@nestjs/common';
import { RedisPropagatorService } from '../../services/RedisPropagatorService';
import { SocketService } from '../../services/SocketService';
import { SocketAdapter } from './SocketAdapter';
import { SessionService } from '../../services/SessionService';
import { RedisService } from '../../services/RedisService';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketService);
  const sessionService = app.get(SessionService);
  const redisService = app.get(RedisService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(
    new SocketAdapter(
      app,
      socketStateService,
      sessionService,
      redisService,
      redisPropagatorService,
    ),
  );

  return app;
};
