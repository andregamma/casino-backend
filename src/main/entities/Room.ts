import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room', { schema: 'casino' })
export class Room {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('varchar', { name: 'password', nullable: true, length: 20 })
  password: string | null;
}
