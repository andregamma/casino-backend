import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGames } from './UserGames';

@Index('room_events_user_games_id_fk', ['userGamesId'], {})
@Entity('room_events', { schema: 'cassino' })
export class RoomEvents {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'event_name', length: 255 })
  eventName: string;

  @Column('json', { name: 'event_json' })
  eventJson: object;

  @Column('int', { name: 'user_games_id' })
  userGamesId: number;

  @ManyToOne(() => UserGames, (userGames) => userGames.roomEvents, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_games_id', referencedColumnName: 'id' }])
  userGames: UserGames;
}
