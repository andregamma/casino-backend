import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGames } from './UserGames';
import { Session } from './Session';

@Index('user_passport_uindex', ['passport'], { unique: true })
@Index('user_username_uindex', ['username'], { unique: true })
@Entity('user', { schema: 'cassino' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 50 })
  username: string;

  @Column('varchar', { name: 'password', nullable: true, length: 72 })
  password: string | null;

  @Column('varchar', { name: 'fullname', nullable: true, length: 255 })
  fullname: string | null;

  @Column('int', { name: 'passport', unique: true })
  passport: number;

  @Column('varchar', { name: 'avatar', nullable: true, length: 255 })
  avatar: string | null;

  @Column('decimal', {
    name: 'balance',
    precision: 12,
    scale: 2,
    default: () => "'0.00'",
  })
  balance: string;

  @OneToMany(() => UserGames, (userGames) => userGames.user)
  userGames: UserGames[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
