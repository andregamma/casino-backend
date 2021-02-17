import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldsSearchable } from '../resources/criteria/Criteria';
import { BaseService } from './BaseService';
import { MatchesRepository } from '../repositories/MatchesRepository';
import { SportsMatches } from '../entities/SportsMatches';

@Injectable()
export class MatchesService extends BaseService<SportsMatches> {
  protected fieldsSearchable: FieldsSearchable = {};

  private logger = new Logger('MatchesService');

  constructor(
    @InjectRepository(MatchesRepository)
    repository: MatchesRepository,
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
