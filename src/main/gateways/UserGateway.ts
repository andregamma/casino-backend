import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
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
import { User } from '../entities/User';
import { RedisPropagatorInterceptor } from '../resources/interceptors/RedisPropagatorInterceptor';
import { BaseGateway } from './BaseGateway';
import { UserService } from '../services/UserService';
import { AuthenticatedSocket } from '../resources/adapters/SocketAdapter';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class UserGateway extends BaseGateway {
  @WebSocketServer() server: SocketIO.Server;

  private logger = new Logger('UserGateway');

  protected eventPrefix = 'user';

  constructor(private userService: UserService) {
    super();
  }

  @SubscribeMessage('user:current')
  public async currentUser(client: AuthenticatedSocket) {
    try {
      const user = await this.userService.get(client.auth.id);

      if (user) {
        return this.event('current', user);
      }

      return this.error('Não foi possível carregar seu usuário');
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async handleConnection(client: any, ...args: any[]): Promise<any> {}

  afterInit = (server: any): any => {
    console.log(this);
    this.logger.log('Iniciado');
  };

  // handleDisconnect(client: any): any {}
}
