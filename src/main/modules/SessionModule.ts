import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from '../controllers/SessionController';
import { Session } from '../entities/Session';
import { SessionRepository } from '../repositories/SessionRepository';
import { SessionService } from '../services/SessionService';
import { RedisService } from '../services/RedisService';
import { RedisModule } from './RedisModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, SessionRepository]),
    RedisModule,
  ],
  controllers: [SessionController],
  exports: [TypeOrmModule, SessionService],
  providers: [SessionService, RedisService],
})
export class SessionModule {}
