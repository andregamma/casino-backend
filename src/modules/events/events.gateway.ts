import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProfileService } from '../profile/profile.service';

@Injectable()
@WebSocketGateway(80)
export class EventsGateway {
  constructor(private profileService: ProfileService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebSocket');

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('getProfile')
  async getProfile(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `getBalance: Cliente ${client.id} requisitando dados do perfil de id #${data.id}`,
    );

    const profile = await this.profileService.get(data.id);
    return profile;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
