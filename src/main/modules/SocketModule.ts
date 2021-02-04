import { Module } from '@nestjs/common';
import { SocketService } from '../services/SocketService';

@Module({
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}