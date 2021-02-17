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
@Entity('session', { schema: 'casino' })
export class Session {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'auth_token', length: 255 })
  authToken: string;

  @Column('tinyint', { name: 'active' })
  active: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
