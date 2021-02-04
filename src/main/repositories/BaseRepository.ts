import { Repository as TypeOrmRepository } from 'typeorm';

export class BaseRepository<Entity> extends TypeOrmRepository<Entity> {}
