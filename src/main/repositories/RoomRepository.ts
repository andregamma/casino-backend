import { EntityRepository } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Room } from '../entities/Room';

@EntityRepository(Room)
export class RoomRepository extends BaseRepository<Room> {}
