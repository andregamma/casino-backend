import { EntityRepository } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { User } from '../entities/User';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
