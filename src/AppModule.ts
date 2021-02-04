import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { TypeOrm } from './main/modules/DatabaseModule';
import { Modules } from './main/modules/Modules';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrm,
    HttpModule,
    Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
