import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProfileService } from 'src/modules/profile/profile.service';

import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@WebSocketGateway(80)
export class DiceGateway {
  constructor(private profileService: ProfileService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebSocket');

  @SubscribeMessage('rollDice')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const clientBet = data.bet;

    try {
      const profile = await this.profileService.get(data.id);

      if (typeof clientBet.amount !== 'number') {
        throw new WsException('Quantidade inválida.');
      }

      if (clientBet.amount <= 0) {
        throw new WsException('A quantidade deve ser maior que zero.');
      }

      if (profile.balance < clientBet.amount) {
        throw new WsException('Fundos insuficientes.');
      }

      const luckyNumber = generateDiceRollValue();

      return luckyNumber;
    } catch (err) {
      this.logger.error(err);
      throw new WsException(err);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.join('diceGame');
    this.logger.log(`Client connected: ${client.id}`);
  }
}

const generateDiceRollValue = async () => {
  const iv = randomBytes(16);
  const password = 'Password used to generate key';

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const textToEncrypt = Math.floor(Math.random() * 7).toString();
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  return textToEncrypt;
};

const getProfit = (rollNum, selNum, amount, payout) => {
  if (
    (selNum * 1 <= 49.5 && rollNum * 1 <= selNum * 1) ||
    (selNum * 1 >= 50.49 && rollNum * 1 >= selNum * 1)
  ) {
    return amount * (payout - 1);
  } else {
    return -1 * amount;
  }
};
