import { Logger, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from 'main/resources/adapters/SocketAdapter';
import { UserService } from '../services/UserService';
import { RoomService } from '../services/RoomService';
import { RedisPropagatorInterceptor } from '../resources/interceptors/RedisPropagatorInterceptor';
import { BaseGateway } from './BaseGateway';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class BlackjackGateway
  extends BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger = new Logger('Blackjack');

  constructor(
    private roomService: RoomService,
    private userService: UserService,
  ) {
    super();
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      client.join('lobby');
      this.showAvailableRooms(client);
      this.logger.log(`Cliente conectado ao lobby: ${client.auth.id}`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.auth.username}`);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const room = await this.roomService.updateOrCreate(data);
      const roomName = `room-${room}`;
      const user = this.userService.get(client.auth.id);

      this.logger.log(`Usuário ${user} criou um novo quarto: ${roomName}`);

      this.showAvailableRooms(client);

      /**
       * check if user is playing
       * if not, create a new room and join it
       */
      /**
      if (user.isPlaying) {
        client
          .to(client.id)
          .emit('showAlert', 'Você só pode jogar um jogo de cada vez.');
      } else {
        // todo: add player to room in database

        // enter new room
        client.leave('lobby');
        client.join(room);

        // this.showTablesForLobby(client);

        // chat messages
        client.in(room).emit('newPlayerInRoom', '{Usuário} entrou na sala');
      }
      */
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  showAvailableRooms = async (client: AuthenticatedSocket) => {
    try {
      const rooms = await this.roomService.getAvailableRooms();
      this.server.in('lobby').emit('showAvailableRooms', rooms);
    } catch (e) {
      this.logger.error(e.message);
    }
  };
}
