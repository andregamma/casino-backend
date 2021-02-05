import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/UserController';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { RedisModule } from './RedisModule';
import { UserGateway } from '../gateways/UserGateway';
import { SocketModule } from './SocketModule';
import { RedisPropagatorModule } from './RedisPropagatorModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    RedisModule,
    SocketModule,
    RedisPropagatorModule,
  ],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
  providers: [UserService, UserGateway],
})
export class UserModule {}
