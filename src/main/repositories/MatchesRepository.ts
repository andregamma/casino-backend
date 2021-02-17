import { EntityRepository } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { SportsMatches } from '../entities/SportsMatches';

@EntityRepository(SportsMatches)
export class MatchesRepository extends BaseRepository<SportsMatches> {}
