import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  Req,
} from '@nestjs/common';
import { NotAuth } from '../resources/guards/auth/NotAuth';
import { SportsMatches } from '../entities/SportsMatches';
import { MatchesService } from '../services/MatchesService';
import { storeBetDTO } from '../providers/RedisProvider/dto/storeBetDTO';
import { BetsService } from '../services/BetsService';
import { SportsBets } from '../entities/SportsBets';

@Controller('match')
export class MatchesController {
  constructor(
    private matchesService: MatchesService,
    private betsService: BetsService,
  ) {}

  @Get()
  @NotAuth()
  async index(@Req() req, @Res() res) {
    try {
      const matches = this.matchesService.useCriteria(SportsMatches, req).get();

      return res.json(matches);
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar as partidas.',
      });
    }
  }

  @Post()
  async store(@Body() req, @Res() res) {
    try {
      await this.matchesService
        .useValidator({
          id: ['cantExist'],
          homeName: ['required', 'string', 'max:191'],
          awayName: ['required', 'string', 'max:191'],
        })
        .passesOrFail(req);

      const params = this.matchesService.setAttributes(req)(SportsMatches);
      const matches = await this.matchesService.repository.save(params);

      return res.json(matches);
    } catch (e) {
      return res.status(400).json({
        error: true,
        message: e.message,
      });
    }
  }

  @Get(':id')
  @NotAuth()
  async show(@Param('id', new ParseIntPipe()) id: number, @Res() res) {
    try {
      const match = await this.matchesService.repository.findOne(id);
      const totalBets = await this.betsService.repository.count({
        matchId: id,
      });
      const homeCount = await this.betsService.repository.count({
        matchId: id,
        betChoice: 1,
      });
      const drawCount = await this.betsService.repository.count({
        matchId: id,
        betChoice: 0,
      });
      const awayCount = await this.betsService.repository.count({
        matchId: id,
        betChoice: -1,
      });

      if (!match) {
        return res.status(400).json({
          error: true,
          message: 'Esta partida não existe',
        });
      }
      return res.json({
        data: {
          match,
          totalBets,
          homeCount,
          drawCount,
          awayCount,
        },
      });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar essa partida',
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req,
    @Res() res,
  ) {
    // todo:
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Res() res) {
    try {
      const deleted = await this.matchesService.repository.delete(id);
      if (deleted.affected < 1) {
        return res.status(400).json({
          error: true,
          message: 'Nenhum item foi encontrado com esse identificador',
        });
      }
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Erro interno ! Não foi possível deletar',
      });
    }
  }
}
