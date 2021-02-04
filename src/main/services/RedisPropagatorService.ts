import { Injectable, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';
import { RedisSocketEventEmitDTO } from '../providers/RedisProvider/dto/RedisSocketEventEmitDTO';
import { RedisSocketEventSendDTO } from '../providers/RedisProvider/dto/RedisSocketEventSendDTO';
import {
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
  REDIS_SOCKET_EVENT_SEND_NAME,
} from '../providers/RedisProvider/RedisConstants';
import { RedisService } from './RedisService';
import { SocketService } from './SocketService';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  private logger = new Logger('RedisPropagatorService');

  public constructor(
    private readonly socketStateService: SocketService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, event, data, socketId } = eventInfo;

    /* this.logger.log(
      `Enviando evento de volta: ${event}, ${data} || socketId: ${socketId} || user: ${
        userId || 'visitante'
      } `,
    ); */

    // this.logger.log(`Enviando para socket: ${socketId}`);

    return this.socketStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    const { event, data } = eventInfo;

    // this.logger.log(`Enviando evento autenticado: ${event}, ${data}`);

    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    // this.logger.log(`Propagando evento... ${JSON.stringify(eventInfo)}`);
    if (!eventInfo.userId) {
      this.logger.error('Sem usuário id');
      // return false;
    }

    // Envia o evento para quem estiver ouvindo
    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);

    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);

    return true;
  }
}
