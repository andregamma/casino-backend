import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { FieldsSearchable } from '../resources/criteria/Criteria';
import { BaseService } from './BaseService';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { RedisService } from './RedisService';

export interface CreateUser {
  success: boolean;
  message: string;
  status: number;
  data?: User;
}

export interface IdentifyUser {
  username: string;
  password: string;
}

export interface IdentifiedUser {
  user?: User;
  success: boolean;
  reason?: string;
}

export interface MemoizedUser extends User {
  lastMemoUpdate: number;
}

interface UserIsMemoized {
  current: MemoizedUser | boolean;
  memo: MemoizedUser[];
  is: boolean;
}

export const REDIS_USER = 'USERS';

export const TIME_FOR_OUTDATE_MEMO_USER = 2;

@Injectable()
export class UserService extends BaseService<User> {
  protected fieldsSearchable: FieldsSearchable = {};

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserRepository)
    repository: UserRepository,
    private redisService: RedisService,
  ) {
    super();
    this.setRepository(repository);
  }

  public async store(user: User): Promise<CreateUser> {
    try {
      const password = await this.encrypt(user.password);
      const lastIp = this.request.ip;
      const regDate = new Date().toISOString();
      const rankId = 1;

      if (password) {
        const created = await this.create({
          ...user,
          password,
          lastIp,
          regDate,
          rankId,
        });
        if (created) {
          return {
            success: true,
            message: 'Usuário criado com sucesso.',
            status: 200,
          };
        }
      }

      return {
        success: false,
        message: 'Não foi possível salvar seu usuário.',
        status: 400,
      };
    } catch (e) {
      console.log(e);
      this.logger.error(e);
      return {
        success: false,
        message: 'Ocorreu um erro interno, tente novamente mais tarde',
        status: 500,
      };
    }
  }

  public async encrypt(password: string): Promise<string | false> {
    try {
      return await bcrypt.hash(password, Number(process.env.SECRET_ROUNDS));
    } catch (e) {
      this.fileLogger.error(e.message);
      return false;
    }
  }

  public async identify(data: IdentifyUser): Promise<IdentifiedUser> {
    try {
      const users = await this.repository.find({
        select: ['id', 'username', 'passport', 'password'],
        where: {
          username: data.username,
        },
      });

      if (users.length < 1) {
        return { success: false, reason: 'Usuário não encontrado' };
      }

      const [user] = users;

      const passwordIsValid = await this.testPassword({
        password: data.password,
        hash: user.password,
      });

      if (passwordIsValid) {
        return { success: true, user };
      }

      return { success: false, reason: 'Senha incorreta' };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        reason:
          'Ocorreu um erro interno ao tentar verificar o usuário, tente mais tarde!',
      };
    }
  }

  public async get(id: number) {
    try {
      const isMemoized = await this.isMemoized(id);

      if (isMemoized) {
        if (isMemoized.is) {
          return isMemoized.current;
        }
      }

      const user = await this.repository.findOne(id);

      this.memoizeOne(user);

      return user;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async memoizeOne(user: User) {
    // Obtem todos os users exceto o atual
    const oldUsers = await this.removeUserFromMemoizedArray(user);
    return this.memoize([...oldUsers, { ...user, lastMemoUpdate: Date.now() }]);
  }

  public async removeUserFromMemoizedArray(
    user: User,
    users?: MemoizedUser[],
  ): Promise<MemoizedUser[]> {
    if (!users) {
      users = (await this.getMemoizedUsers()) || [];
    }

    return users.filter((memoizedUser) => memoizedUser.id !== user.id);
  }

  public async getMemoizedUsers(): Promise<MemoizedUser[] | false> {
    try {
      return this.redisService.get<MemoizedUser[]>(REDIS_USER);
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async isMemoized(userId: number): Promise<UserIsMemoized | false> {
    try {
      const memoized = await this.getMemoizedUsers();

      if (memoized) {
        const user = memoized.find((user) => user.id === userId) || false;

        return { is: !!user, memo: memoized, current: user };
      }

      return false;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  private memoize(users: MemoizedUser[]) {
    return this.redisService.set(REDIS_USER, users);
  }

  private async clearUnsed(): Promise<boolean> {
    try {
      const memoized = (await this.getMemoizedUsers()) || [];

      const usedUsers = [];

      memoized.forEach((memoUser) => {
        const isOutdated = this.isOutdatedUpdate(memoUser.lastMemoUpdate);

        if (!isOutdated) {
          usedUsers.push(memoUser);
        }
      });

      await this.memoize(usedUsers);

      return true;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async testPassword({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (e) {
      return false;
    }
  }

  private isOutdatedUpdate(lastMemoUpdate: number) {
    const seconds = Math.round(lastMemoUpdate / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = minutes / 60;

    return hours > TIME_FOR_OUTDATE_MEMO_USER;
  }
}
