import { Logger, UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import SocketIO from 'socket.io';
import { RedisPropagatorInterceptor } from '../resources/interceptors/RedisPropagatorInterceptor';
import { BaseGateway } from './BaseGateway';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class SportmatchesGateway
  extends BaseGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: SocketIO.Server;

  private logger = new Logger('SportmatchesGateway');

  protected eventPrefix = 'sportmatches';

  constructor() {
    super();
  }

  @SubscribeMessage('sportmatches:example')
  public sportmatchesMessage() {}

  async handleConnection(client: any, ...args: any[]): Promise<any> {}

  afterInit(server: any): any {}

  handleDisconnect(client: any): any {}
}
