import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site_config', { schema: 'casino' })
export class SiteConfig {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'title',
    nullable: true,
    length: 255,
    default: () => "'Diamond Casino'",
  })
  title: string | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['active', 'disabled'],
    default: () => "'active'",
  })
  status: 'active' | 'disabled' | null;

  @Column('int', { name: 'withdraw_tax', default: () => "'30'" })
  withdrawTax: number;
}
