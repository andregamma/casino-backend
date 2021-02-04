import { EntityRepository } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Session } from '../entities/Session';

@EntityRepository(Session)
export class SessionRepository extends BaseRepository<Session> {}
