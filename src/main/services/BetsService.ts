import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import { SportsBets } from '../entities/SportsBets';
import { BetsRepository } from '../repositories/BetsRepository';
import { BaseService } from './BaseService';

@Injectable()
export class BetsService extends BaseService<SportsBets> {
  private logger = new Logger('BetsService');

  constructor(
    @InjectRepository(BetsRepository)
    repository: BetsRepository,
    @Inject(REQUEST) protected request: Request,
  ) {
    super();
    this.setRepository(repository);
  }

  async findAll() {
    try {
      const matches = await this.repository.find();

      return matches;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async get(id: number) {
    try {
      const matches = await this.repository.findOne(id);

      return matches;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }
}
