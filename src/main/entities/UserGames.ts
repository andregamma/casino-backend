import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { RoomEvents } from './RoomEvents';

@Index(
  'user_games_user_id_game_id_room_id_uindex',
  ['userId', 'gameId', 'roomId'],
  { unique: true },
)
@Entity('user_games', { schema: 'casino' })
export class UserGames {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'game_id' })
  gameId: number;

  @Column('int', { name: 'room_id', nullable: true })
  roomId: number | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['active', 'canceled', 'finished'],
    default: () => "'active'",
  })
  status: 'active' | 'canceled' | 'finished' | null;

  @ManyToOne(() => User, (user) => user.userGames, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => RoomEvents, (roomEvents) => roomEvents.userGames)
  roomEvents: RoomEvents[];
}
