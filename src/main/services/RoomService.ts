import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldsSearchable } from '../resources/criteria/Criteria';
import { BaseService } from './BaseService';
import { RoomRepository } from '../repositories/RoomRepository';
import { Room } from '../entities/Room';
import { RedisService } from './RedisService';

export const REDIS_ROOM = 'ROOMS';

export interface MemoizedRoom extends Room {
  lastUse: number;
}

@Injectable()
export class RoomService extends BaseService<Room> {
  protected fieldsSearchable: FieldsSearchable = {};

  private logger = new Logger('RoomService');

  constructor(
    @InjectRepository(RoomRepository)
    repository: RoomRepository,
    private redisService: RedisService,
  ) {
    super();
    this.setRepository(repository);
  }

  public async getRoom(roomId: number): Promise<MemoizedRoom | false> {
    let room = await this.isLoaded(roomId);

    if (!room) {
      const fromDatabase = await this.loadFromDatabase(roomId);

      if (!fromDatabase) {
        return false;
      }

      room = { ...fromDatabase, lastUse: Date.now() };
    } else {
      room.lastUse = Date.now();
    }

    await this.updateOrCreate(room);

    return room;
  }

  public async getAvailableRooms() {
    try {
      return this.repository.find();
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async isLoaded(roomId: number): Promise<MemoizedRoom | false> {
    const rooms = await this.roomsMemo;

    if (rooms) {
      return rooms.find((room) => room.id === roomId) || false;
    }

    return false;
  }

  public async updateOrCreate(room: MemoizedRoom) {
    const rooms = await this.roomsMemo;

    if (rooms) {
      const index = rooms.findIndex(
        (memoizedRoom) => memoizedRoom.id === room.id,
      );

      // Não está na memoria
      if (index < 0) {
        rooms.push(room);
      } else {
        rooms[index] = room;
      }

      return this.setRoomsMemo(rooms);
    }
    return this.setRoomsMemo([room]);
  }

  public async loadFromDatabase(roomId: number) {
    try {
      return this.repository.findOne(roomId);
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  private async setRoomsMemo(rooms: MemoizedRoom[]) {
    return this.redisService.set(REDIS_ROOM, rooms);
  }

  private get roomsMemo() {
    return this.redisService.get<MemoizedRoom[]>(REDIS_ROOM);
  }
}
