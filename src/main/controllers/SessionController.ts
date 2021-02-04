import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  Req,
  Logger,
} from '@nestjs/common';
import { NotAuth } from '../resources/guards/auth/NotAuth';
import { SessionService } from '../services/SessionService';
import { User } from '../entities/User';

@Controller('session')
export class SessionController {
  private logger = new Logger('SessionController');

  constructor(private sessionService: SessionService) {}

  @Post()
  @NotAuth()
  async store(@Body() req, @Res() res) {
    try {
      await this.sessionService
        .useValidator({
          username: ['required', 'string', 'max:75'],
          password: ['required', 'string', 'max:255'],
        })
        .passesOrFail(req);

      // const identified = await this.playerService.identify(req);

      const identified: { success: boolean; player: User; reason: string } = {
        success: true,
        // @ts-ignore
        player: { id: 1, username: '', password: '' },
        reason: '',
      };

      if (identified.success) {
        const token = await this.sessionService.generate(identified.player);

        if (token) {
          return res.json(token);
        }
        return res.status(401).json({
          error: true,
          message: 'Não foi possível criptografar sua conexão',
        });
      }

      return res.status(401).json({
        error: true,
        message: identified.reason,
      });
    } catch (e) {
      return res.status(400).json({
        error: true,
        message: e.message,
      });
    }
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id, @Res() res) {
    try {
      const deleted = await this.sessionService.repository.delete(id);
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
