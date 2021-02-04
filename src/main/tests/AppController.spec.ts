import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../AppController';
import { AppService } from '../../AppService';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {});
});
