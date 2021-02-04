import { INestApplication } from '@nestjs/common';

export class NestApplication {
  private static nestApplication;

  static getInstance(app?: INestApplication) {
    if (!NestApplication.nestApplication)
      NestApplication.nestApplication = new NestApplication(app);

    return NestApplication.nestApplication;
  }

  constructor(protected app?: INestApplication) {}

  get() {
    return this.app;
  }
}
