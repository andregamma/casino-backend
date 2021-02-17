import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SportsMatches } from './SportsMatches';
import { User } from './User';

@Index('sports_bets_ id_uindex', ['id'], { unique: true })
@Index('sports_bets_sports_matches_id_fk', ['matchId'], {})
@Index('sports_bets_user_id_fk', ['userId'], {})
@Entity('sports_bets', { schema: 'casino' })
export class SportsBets {
  @PrimaryGeneratedColumn({ type: 'int', name: ' id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'match_id' })
  matchId: number;

  @Column('int', { name: 'bet_choice' })
  betChoice: number;

  @Column('double', { name: 'profit', precision: 8, scale: 2 })
  profit: number;

  @Column('double', { name: 'rate', precision: 5, scale: 2 })
  rate: number;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => SportsMatches, (sportsMatches) => sportsMatches.sportsBets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'match_id', referencedColumnName: 'id' }])
  match: SportsMatches;

  @ManyToOne(() => User, (user) => user.sportsBets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
