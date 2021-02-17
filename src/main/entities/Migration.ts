import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('migration', { schema: 'casino' })
export class Migration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('bigint', { name: 'timestamp' })
  timestamp: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;
}
