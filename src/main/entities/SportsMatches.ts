import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SportsBets } from './SportsBets';

@Index('sports_matches_id_uindex', ['id'], { unique: true })
@Entity('sports_matches', { schema: 'casino' })
export class SportsMatches {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'home_name', length: 191 })
  homeName: string;

  @Column('varchar', { name: 'away_name', length: 191 })
  awayName: string;

  @Column('double', { name: 'home_rate', precision: 5, scale: 2 })
  homeRate: number;

  @Column('double', { name: 'draw_rate', precision: 5, scale: 2 })
  drawRate: number;

  @Column('double', { name: 'away_rate', precision: 5, scale: 2 })
  awayRate: number;

  @Column('int', { name: 'home_score', nullable: true })
  homeScore: number | null;

  @Column('int', { name: 'away_score', nullable: true })
  awayScore: number | null;

  @Column('datetime', { name: 'time_close_bet' })
  timeCloseBet: Date;

  @Column('datetime', { name: 'time_start' })
  timeStart: Date;

  @Column('datetime', { name: 'time_end' })
  timeEnd: Date;

  @Column('tinyint', { name: 'public', width: 1, default: () => "'0'" })
  public: boolean;

  @Column('enum', {
    name: 'status',
    enum: ['active', 'disabled', 'finished'],
    default: () => "'active'",
  })
  status: 'active' | 'disabled' | 'finished';

  @Column('int', { name: 'result', nullable: true })
  result: number | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => SportsBets, (sportsBets) => sportsBets.match)
  sportsBets: SportsBets[];
}
