import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('games_display_name_uindex', ['displayName'], { unique: true })
@Index('games_name_uindex', ['name'], { unique: true })
@Entity('games', { schema: 'cassino' })
export class Games {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'display_name', unique: true, length: 255 })
  displayName: string;

  @Column('varchar', { name: 'name', unique: true, length: 50 })
  name: string;
}
