import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SportsBets } from '../entities/SportsBets';
import { storeBetDTO } from '../providers/RedisProvider/dto/storeBetDTO';
import { BetsService } from '../services/BetsService';
import { MatchesService } from '../services/MatchesService';
import { UserService } from '../services/UserService';

@Controller('bet')
export class BetsController {
  constructor(
    private matchesService: MatchesService,
    private betsService: BetsService,
    private userService: UserService,
  ) {}

  @Get()
  async index(@Req() req, @Res() res) {
    try {
      const bets = await this.betsService.useCriteria(SportsBets, req).get();

      return res.json(bets);
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar as apostas',
      });
    }
  }

  @Post()
  async store(@Body() req: storeBetDTO, @Res() res) {
    try {
      const user = await this.userService.repository.findOne(req.user_id);
      if (!user) {
        return res.status(400).json({
          error: true,
          message: 'O usuário informado não existe',
        });
      }

      await this.betsService
        .useValidator({
          id: ['cantExist'],
          userId: ['required', 'number'],
          matchId: ['required', 'number'],
          betChoice: ['required', 'number'],
          quantity: ['required', 'number', 'min:1', `max:${user.balance}`],
        })
        .passesOrFail(req);

      let rate = 0;
      const profit = 0;

      const params = this.betsService.setAttributes(req)(SportsBets);
      const match = await this.matchesService.get(req.match_id);

      if (!match) {
        return res.status(400).json({
          error: true,
          message: 'A partida informada não existe',
        });
      }
      if (match.status !== 'active') {
        return res.status(400).json({
          error: true,
          message: 'Essa partida não está aceitando novas apostas',
        });
      }

      const newUserBalance: number = Number(user.balance) - params.quantity;

      switch (params.bet_choice) {
        case 1:
          rate = match.homeRate;
          break;
        case 0:
          rate = match.drawRate;
          break;
        case -1:
          rate = match.awayRate;
          break;
        default:
          break;
      }

      try {
        await this.betsService.repository.save({
          ...params,
          rate,
          profit,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (e) {
        return res.status(500).json({
          error: true,
          message: 'Não foi possível criar a aposta',
        });
      }

      await this.userService.repository.update(user.id, {
        balance: newUserBalance.toString(),
      });

      return res.json({
        error: false,
        message: 'Aposta feita com sucesso',
      });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  }

  @Get(':id')
  async show(@Param('id', new ParseIntPipe()) id: number, @Res() res) {
    try {
      const bet = await this.betsService.repository.findOne(id);
      if (!bet) {
        return res.status(400).json({
          error: true,
          message: 'Essa aposta não existe',
        });
      }
      return res.json({ data: bet });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar essa aposta',
      });
    }
  }
}
