import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './AppService';
import { NotAuth } from './main/resources/guards/auth/NotAuth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @NotAuth()
  getHello(@Res() res): string {
    return res.json({
      api: {
        status: 'OK',
        message: 'All endpoints are running',
      },
      socket: {
        status: 'OK',
        message: 'All listeners are running',
      },
    });
  }
}
