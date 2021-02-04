import { Request } from 'express';
import { BaseRepository } from '../repositories/BaseRepository';
import { Validator } from '../resources/validator';
import { GenericsValidator } from '../resources/validator/Generics';
import { User } from '../entities/User';

export class BaseService<T> {
  protected validator: Validator;

  protected user: BaseRepository<User>;

  protected request?: Request;

  constructor(public repository: BaseRepository<T>) {
    this.validator = new Validator();
  }

  public useValidator(validatorFields: object) {
    return this.validator.resetFields().addFields(validatorFields);
  }

  public get genericValidator(): GenericsValidator {
    return this.validator.generics;
  }

  public getValidator(): Validator {
    return this.validator;
  }
}
