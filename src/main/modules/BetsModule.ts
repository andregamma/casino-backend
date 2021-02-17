import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsController } from '../controllers/BetsController';
import { SportsBets } from '../entities/SportsBets';
import { BetsRepository } from '../repositories/BetsRepository';
import { BetsService } from '../services/BetsService';

import { MatchesModule } from './MatchesModule';
import { UserModule } from './UserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([SportsBets, BetsRepository]),
    UserModule,
    forwardRef(() => MatchesModule),
  ],
  controllers: [BetsController],
  exports: [TypeOrmModule, BetsService],
  providers: [BetsService],
})
export class BetsModule {}
