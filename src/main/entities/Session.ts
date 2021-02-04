import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('pk_sessions', ['id'], { unique: true })
@Entity('session', { schema: 'public' })
export class Session {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'auth_token', length: 255 })
  authToken: string;

  @Column('boolean', { name: 'active' })
  active: boolean;

  @Column('datetime', { name: 'created_at' })
  created: string;

  @ManyToOne(() => User, (player) => player.sessions)
  @JoinColumn([{ name: 'user_id' }])
  user: User;
}
