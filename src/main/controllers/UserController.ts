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
import { userID as UserID } from '../resources/guards/auth/UserID';
import { User } from '../entities/User';
import { UserService } from '../services/UserService';
import {
  UserTransformer,
  UserTransformerOptions,
} from '../transformers/UserTransformer';
import { UpdateUserDto } from '../providers/RedisProvider/dto/UpdateUserDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async index(@Req() req, @Res() res) {
    try {
      const players = await this.userService
        .useCriteria(User, req)
        .withTransformer(new UserTransformer(), {
          withRankPermissions: false,
        })
        .relations(['rank'])
        .get();

      return res.json(players);
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar os jogadores',
      });
    }
  }

  @Post()
  @NotAuth()
  async store(@Body() req, @Res() res) {
    try {
      await this.userService
        .useValidator({
          id: ['cantExist'],
          username: ['required', 'string', 'max:75', 'unique:username'],
          password: ['required', 'string', 'max:255'],
          passport: ['required', 'string', 'unique:passport'],
        })
        .passesOrFail(req);

      const params = this.userService.setAttributes(req)(User);
      const created = await this.userService.store(params);

      return res.status(created.status).json(created);
    } catch (e) {
      return res.status(400).json({
        error: true,
        message: e.message,
      });
    }
  }

  @Get('current')
  async current(@UserID() userID, @Res() res) {
    try {
      console.log(userID);
      const user = await this.userService.repository.findOne(userID);
      return res.json({ data: user });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar o jogador atual',
      });
    }
  }

  @Get(':id')
  async show(@Param('id', new ParseIntPipe()) id: number, @Res() res) {
    try {
      const user = await this.userService.repository.findOne(id);
      if (!user) {
        return res.status(400).json({
          error: true,
          message: 'Este usuário não existe',
        });
      }
      return res.json({ data: user });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível listar o jogador atual',
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req: UpdateUserDto,
    @Res() res,
  ) {
    try {
      const updated = await this.userService.repository.update(id, req);
      const user = await this.userService.repository.findOne(id);
      if (updated.affected < 1) {
        return res.status(400).json({
          error: true,
          message: 'Nenhum item foi encontrado com esse identificador',
        });
      }

      return res.json({ data: user });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'Não foi possível atualizar esse usuário',
      });
    }
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id, @Res() res) {
    try {
      const deleted = await this.userService.repository.delete(id);
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
