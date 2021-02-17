import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from '../controllers/MatchesController';
import { SportsMatches } from '../entities/SportsMatches';
import { MatchesRepository } from '../repositories/MatchesRepository';
import { MatchesService } from '../services/MatchesService';
import { BetsModule } from './BetsModule';
import { UserModule } from './UserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchesRepository]),
    UserModule,
    forwardRef(() => BetsModule),
  ],
  controllers: [MatchesController],
  exports: [TypeOrmModule, MatchesService],
  providers: [MatchesService],
})
export class MatchesModule {}
