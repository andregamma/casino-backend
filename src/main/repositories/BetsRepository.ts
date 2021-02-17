import { EntityRepository } from 'typeorm';
import { SportsBets } from '../entities/SportsBets';
import { BaseRepository } from './BaseRepository';

@EntityRepository(SportsBets)
export class BetsRepository extends BaseRepository<SportsBets> {}
