import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('server_permissions_ranks', { schema: 'casino' })
export class ServerPermissionsRanks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 50, default: () => "'Default'" })
  name: string;

  @OneToMany(() => User, (user) => user.rank)
  users: User[];
}
