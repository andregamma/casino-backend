import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socket from 'socket.io';
import { RedisPropagatorService } from '../../services/RedisPropagatorService';
import { SocketService } from '../../services/SocketService';
import { SessionService, TokenPlayerData } from '../../services/SessionService';
import { RedisService } from '../../services/RedisService';

export interface Handshake {
  /**
   * The headers sent as part of the handshake
   */
  headers: any;
  /**
   * The date of creation (as string)
   */
  time: string;
  /**
   * The ip of the client
   */
  address: string;
  /**
   * Whether the connection is cross-domain
   */
  xdomain: boolean;
  /**
   * Whether the connection is secure
   */
  secure: boolean;
  /**
   * The date of creation (as unix timestamp)
   */
  issued: number;
  /**
   * The request URL string
   */
  url: string;
  /**
   * The query object
   */
  query: any;
  /**
   * The auth object
   */
  auth: object;
}

export interface AuthenticatedSocket extends socket.Socket {
  auth: TokenPlayerData;
  handshake: Handshake;
}

export const defaultSocketOptions = {
  transports: ['websocket', 'polling'],
};

export class SocketAdapter extends IoAdapter implements WebSocketAdapter {
  private server: socket.Server;

  private logger = new Logger('SocketAdapter');

  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketService,
    private readonly sessionService: SessionService,
    private readonly redisService: RedisService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super();
  }

  bindClientConnect(serverPromise, callback: Function) {
    const promises = Promise.all([serverPromise]);

    promises.then((servers) => {
      const [server] = servers;
      server.on('connection', (socket) => {
        callback(socket);

        socket.on('disconnect', (reason) => {
          this.sessionService
            .removeSocketFromSession(socket.id)
            .then(() => this.logger.log(`Token removido da sessão: ${reason}`));
        });
      });
      this.logger.log('Novo cliente conectado');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  bindClientDisconnect(client: any, callback: Function) {}

  close(server) {
    server.close();
    this.logger.log('Desligando servidor de socket');
  }

  public async create(port?: number, options?): Promise<socket.Server> {
    if (Object.keys(options).length === 0) {
      options = defaultSocketOptions;
    }

    if (!port) {
      port = Number(process.env.SERVER_SOCKET_PORT);
    }

    this.logger.log(`Criando server na porta ${port}`);

    // Removemos todos os sockets das sessões dos players antes de reconstruir o server para evitar "Sessão Duplicada"
    await this.sessionService.removeAllSockets();

    this.server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(this.server);

    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (token) {
        try {
          const decoded = this.sessionService.decodeToken(token);

          if (decoded) {
            const currentUserSession = await this.sessionService.getPlayerSession(
              decoded.id,
            );

            if (currentUserSession) {
              if (currentUserSession.socketId) {
                if (currentUserSession.socketId !== socket.id) {
                  this.logger.warn(
                    `Usuário com sessão duplicada: ${decoded.username} | socket salvo: ${currentUserSession.socketId} | socket atual: ${socket.id}`,
                  );

                  await this.sessionService.removePlayerSession(
                    currentUserSession.player.id,
                  );

                  // Desconecta o cliente que estava conectado anteriormente
                  const client = this.server.sockets.sockets[
                    currentUserSession.socketId
                  ];

                  if (client) {
                    client.disconnect();
                  }

                  return next(new Error('Sessão duplicada'));
                }
              } else {
                if (
                  !(await this.sessionService.setSocketIdInSession(
                    socket.id,
                    decoded.id,
                  ))
                ) {
                  return next(
                    new Error(
                      'Não foi possível salvar o identificador da sessão',
                    ),
                  );
                }
              }

              socket.auth = decoded;
            } else {
              return next(new Error('Sessão não encontrada'));
            }
          } else {
            return next(
              new Error('Não foi possível decodificar o token do usuário'),
            );
          }
        } catch (e) {
          this.logger.warn(e.message);
          return next(new Error('Não foi possível validar o token'));
        }
      } else {
        // Não autenticado
        return next(new Error('Usuário não autenticado'));
      }

      try {
        return next();
      } catch (e) {
        return next(e);
      }
    });

    return this.server;
  }
}
