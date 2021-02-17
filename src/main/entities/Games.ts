import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('games_display_name_uindex', ['displayName'], { unique: true })
@Index('games_name_uindex', ['name'], { unique: true })
@Index('IDX_28639e6be5f363b0257ec04e14', ['name'], { unique: true })
@Index('IDX_2a389e85d22c3207ca93f7d500', ['displayName'], { unique: true })
@Entity('games', { schema: 'casino' })
export class Games {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'display_name', unique: true, length: 255 })
  displayName: string;

  @Column('varchar', { name: 'name', unique: true, length: 50 })
  name: string;
}
