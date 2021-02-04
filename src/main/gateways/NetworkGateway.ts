import { Inject, Injectable, Logger, UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import SocketIO from 'socket.io';
import { RedisPropagatorInterceptor } from '../resources/interceptors/RedisPropagatorInterceptor';
import { BaseGateway } from './BaseGateway';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
@Injectable()
export class NetworkGateway
  extends BaseGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: SocketIO.Server;

  private logger = new Logger('NetworkGateway');

  protected eventPrefix = 'network';

  constructor() {
    super();
  }

  @SubscribeMessage('network:ping')
  public ping(@MessageBody() body): number {
    const ping = Number(body);
    const pong = ping ? Date.now() - ping : 9999;
    if (pong) {
      return pong;
    }
  }

  async handleConnection(client: any, ...args: any[]): Promise<any> {
    this.logger.log(`conectado: ${client.id}`);
  }

  handleDisconnect(client: any): any {
    this.logger.log(`desconectado: ${client.id}`);
  }

  afterInit(server: any): any {
    this.logger.log('Iniciado');
  }
}
