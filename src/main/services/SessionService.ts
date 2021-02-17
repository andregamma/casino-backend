import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import { BaseService } from './BaseService';
import { SessionRepository } from '../repositories/SessionRepository';
import { Session } from '../entities/Session';
import { RedisService } from './RedisService';
import { User } from '../entities/User';

export interface TokenGenerate {
  user: User;
  token: string;
  socketId?: string;
}

export interface TokenPlayerData {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

const SESSIONS = 'SESSIONS';

@Injectable()
export class SessionService extends BaseService<Session> {
  private logger = new Logger('SessionService');

  constructor(
    @InjectRepository(SessionRepository)
    repository: SessionRepository,
    private redisService: RedisService,
  ) {
    super();
    this.setRepository(repository);
  }

  public async generate(
    user: User,
    expiresIn = '48h',
  ): Promise<TokenGenerate | false> {
    try {
      const payload = this.generateJwtPayload(user);

      await this.invalidatePreviousKeys(user);

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

      const created = await this.repository.insert({
        userId: user.id,
        authToken: token,
        active: 1,
        createdAt: new Date().toISOString(),
      });

      if (user.password) {
        delete user.password;
      }

      const generated = { user, token };

      const saved = await this.saveOnMemory(generated);

      if (!saved) {
        return false;
      }

      return generated;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public generateJwtPayload(player: User) {
    return {
      id: player.id,
      username: player.username,
    };
  }

  public async invalidatePreviousKeys(player: User): Promise<boolean> {
    try {
      const previousKeys = await this.repository.update(
        {
          userId: player.id,
          active: 1,
        },
        {
          active: 1,
        },
      );

      this.logger.log(
        `Foram revogados ${previousKeys.affected || 0} chave(s) do player: ${
          player.username
        }`,
      );
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public decodeToken(token: string): TokenPlayerData | false {
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as TokenPlayerData;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public async setSocketIdInSession(
    socketId: string,
    userId: number,
  ): Promise<TokenGenerate | false> {
    try {
      const session = await this.getPlayerSession(userId);

      if (session) {
        session.socketId = socketId;

        this.logger.log(`Inserindo socketId na sessão de ${session.user.id}`);

        await this.saveOnMemory(session);

        return session;
      }
      return false;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async removeSocketFromSession(
    socketId: string,
  ): Promise<TokenGenerate | false> {
    try {
      const session = await this.getSessionBySocketId(socketId);

      if (session) {
        this.logger.log(`Removendo socket da sessão de ${session.user.id}`);
        if (session.socketId) {
          delete session.socketId;
        }

        await this.saveOnMemory(session);

        return session;
      }
      return false;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  private async saveOnMemory(generatedToken: TokenGenerate): Promise<boolean> {
    const oldKeys = await this.getMemoizedTokens();
    if (oldKeys) {
      // Remove o objeto do player atual das chaves antigas
      const oldTokensWithoutCurrentPlayer = this.removeCurrentPlayerFromTokens(
        oldKeys,
        generatedToken.user.id,
      );

      // Insere o novo token do player atual
      return this.redisService.set(SESSIONS, [
        ...oldTokensWithoutCurrentPlayer,
        generatedToken,
      ]);
    }

    return this.redisService.set(SESSIONS, [generatedToken]);
  }

  private async replaceMemo(tokens: TokenGenerate[]) {
    return this.redisService.set(SESSIONS, tokens);
  }

  public removeCurrentPlayerFromTokens(keys: TokenGenerate[], userId: number) {
    return keys.filter((token) => token.user.id !== userId);
  }

  public async removePlayerSession(userId: number) {
    const sessions = await this.getMemoizedTokens();

    if (sessions) {
      const newSessions = this.removeCurrentPlayerFromTokens(sessions, userId);

      return this.redisService.set(SESSIONS, newSessions);
    }
  }

  public async removeAllSockets() {
    const sessions = await this.getMemoizedTokens();

    if (sessions) {
      sessions.map((session) => {
        if (session.socketId) {
          delete session.socketId;
        }

        return session;
      });

      const replaced = await this.replaceMemo(sessions);

      if (replaced) {
        this.logger.log(`Sockets de sessão dos players foram resetados`);
      } else {
        this.logger.error(
          'Não foi possível resetar os sockets de sessão dos players',
        );
      }
    }
  }

  public async getPlayerSession(
    userId: number,
    tokens?: TokenGenerate[],
  ): Promise<TokenGenerate | false> {
    if (!tokens) {
      const memoized = await this.getMemoizedTokens();

      if (memoized) {
        tokens = memoized;
      } else {
        return false;
      }
    }

    return tokens.find((token) => token.user.id === userId) || false;
  }

  public async getSessionBySocketId(
    socketId: string,
  ): Promise<TokenGenerate | false> {
    try {
      const sessions = await this.getMemoizedTokens();

      if (sessions) {
        return (
          sessions.find((session) => session.socketId === socketId) || false
        );
      }

      return false;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public getMemoizedTokens() {
    return this.redisService.get<TokenGenerate[]>(SESSIONS);
  }

  public injectRedis(redisService: RedisService) {
    this.redisService = redisService;

    // Quando o redis é injetado externamente, a classe pode não construir o objeto de log
    if (!this.logger) {
      this.logger = new Logger('SessionService');
    }
  }
}
