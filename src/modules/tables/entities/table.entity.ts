import { Profile } from 'src/modules/profile/profile.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Table Entity Class
 */

@Entity({
  name: 'tables',
})
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  players: [
    {
      profile: Profile;
      bet: number;
      points: number;
      hand: [];
      isPlaying: boolean;
    },
  ];

  @Column()
  active: boolean;
}
