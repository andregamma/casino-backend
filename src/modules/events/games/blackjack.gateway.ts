import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ProfileService } from 'src/modules/profile/profile.service';
import { Table } from 'src/modules/tables/entities/table.entity';
import { TablesService } from 'src/modules/tables/tables.service';

@WebSocketGateway(80, { namespace: 'blackjack' })
export class BlackjackGateway {
  private logger: Logger = new Logger('BlackJack');
  constructor(
    private tableService: TablesService,
    private profileService: ProfileService,
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    client.join('lobby');
  }

  /**
   * Removes a profile from the database
   * @param data table name and password
   * @returns {Promise<IGenericMessageBody>} whether or not the profile has been deleted
   */
  //@UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('createTable')
  async createTable(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const table = await this.tableService.create(data.table);
      const room = `table-${table.id}`;
      const user = this.profileService.get(client.auth.id);

      if (user.isPlaying) {
        client
          .to(client.id)
          .emit('showAlert', 'Você só pode jogar um jogo de cada vez.');
      } else {
        this.profileService.edit(data.user);
        this.tableService.addPlayer(user);

        // enter new room
        client.leave('lobby');
        client.join(room);

        this.showTablesForLobby(client);

        // chat messages
        client.in(room).emit('newPlayerInRoom', table.players.profile.username);
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async showTablesForLobby(client: Socket) {
    try {
      const tables = await this.tableService.findActiveTables();

      client.in('lobby').emit('showTables', tables);
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
