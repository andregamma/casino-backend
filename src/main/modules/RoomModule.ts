import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/Room';
import { RoomRepository } from '../repositories/RoomRepository';
import { RoomService } from '../services/RoomService';
import { RedisService } from '../services/RedisService';
import { RedisModule } from './RedisModule';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomRepository]), RedisModule],
  controllers: [],
  exports: [TypeOrmModule, RoomService],
  providers: [RoomService, RedisService],
})
export class RoomModule {}
