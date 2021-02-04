import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tablesRepository: Repository<Table>,
  ) {}

  create(createTableDto: CreateTableDto) {
    return this.tablesRepository.save(
      this.tablesRepository.create({
        ...createTableDto,
      }),
    );
  }

  findAll() {
    return `This action returns all tables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  findActiveTables() {
    return this.tablesRepository.find({ active: true });
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }

  /** GAME */
  setPlayerPoints(playerId) {
    const query = this.tablesRepository
      .createQueryBuilder('players')
      .where('players.profile.id @> ARRAY[:id]', {
        id: playerId,
      })
      .getOne();
    console.log(query);
  }
}
