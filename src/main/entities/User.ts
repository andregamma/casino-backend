import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './Session';
import { UserGames } from './UserGames';
import { SportsBets } from './SportsBets';
import { ServerPermissionsRanks } from './ServerPermissionsRanks';

@Index('IDX_6ae4003e5fa6df966c1e4d8ddc', ['passport'], { unique: true })
@Index('IDX_78a916df40e02a9deb1c4b75ed', ['username'], { unique: true })
@Index('REL_cace4a159ff9f2512dd4237376', ['id'], { unique: true })
@Index('user_passport_uindex', ['passport'], { unique: true })
@Index('user_server_permissions_ranks_id_fk', ['rank'], {})
@Index('user_username_uindex', ['username'], { unique: true })
@Entity('user', { schema: 'casino' })
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

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => UserGames, (userGames) => userGames.user)
  userGames: UserGames[];

  @OneToMany(() => SportsBets, (sportsBets) => sportsBets.user)
  sportsBets: SportsBets[];

  @ManyToOne(
    () => ServerPermissionsRanks,
    (serverPermissionsRanks) => serverPermissionsRanks.users,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'rank', referencedColumnName: 'id' }])
  rank: ServerPermissionsRanks;
}
