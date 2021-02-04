import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedSocket } from '../adapters/SocketAdapter';
import { RedisPropagatorService } from '../../services/RedisPropagatorService';

@Injectable()
export class RedisPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>> {
  private logger = new Logger('RedisPropagatorInterceptor');

  public constructor(
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    this.logger.log('initialized');
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        this.redisPropagatorService.propagateEvent({
          ...data,
          socketId: socket.id,
          userId: socket.auth.id,
        });
      }),
    );
  }
}
