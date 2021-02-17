import { Request } from 'express';
import { User } from '../entities/User';
import { BaseRepository } from '../repositories/BaseRepository';
import { Criteria, FieldsSearchable } from '../resources/criteria/Criteria';
import { FLogger } from '../resources/logger';
import { Validator } from '../resources/validator';
import { GenericsValidator } from '../resources/validator/Generics';

export interface BaseServiceOptions {
  useConfig?: boolean;
}

export class BaseService<T> {
  public repository: Partial<BaseRepository<T>> | null = null;

  protected validator: Validator;

  protected user: BaseRepository<User>;

  protected request?: Request;

  protected fieldsSearchable: FieldsSearchable = {};

  private optionsGenerated = false;

  public fileLogger: FLogger;

  public notification: Notification | false = false;

  constructor(options?: BaseServiceOptions) {
    this.validator = new Validator();
    this.fileLogger = new FLogger();
  }

  protected setRepository(repository: Partial<BaseRepository<T>>) {
    this.validator.setRepository(repository);
    this.repository = repository;
  }

  public useCriteria(entity: new () => T, request?: Request) {
    if (!request) {
      if (!this.request) {
        throw new Error(
          'É preciso construir o serviço com Request ou passar Request como parametro !',
        );
      }
    }

    if (this.repository) {
      const criteria = new Criteria<T>(
        entity,
        this.repository,
        request || this.request,
      );

      return criteria.setFieldsSearchable(this.fieldsSearchable);
    }

    throw new Error('Não foi possível acessar o repository para o Criteria');
  }

  public className(className) {
    let ret = className.toString();
    ret = ret.substr('class '.length);
    ret = ret.substr(0, ret.indexOf('{'));
    return ret;
  }

  public resolveAttributes<T>(Entity, attributes, stringEmptyToNull): T {
    const keys = Object.keys(attributes);

    keys.forEach((item) => {
      const value = attributes[item];
      Entity[item] = value === '' && stringEmptyToNull ? null : value;
    });

    return Entity;
  }

  public async setAttributesByRepository(
    id: number,
    attributes?: Object,
    stringEmptyToNull = false,
  ) {
    try {
      const finded = await this.repository.findOne(id);

      if (!finded) {
        return false;
      }

      return this.resolveAttributes(finded, attributes, stringEmptyToNull);
    } catch (error) {
      throw new Error(error);
    }
  }

  public setAttributes<T>(
    attributes?: Object,
    stringEmptyToNull = false,
  ): Function {
    const classThis = this;
    return function resolveAttributesByFunction<T>(Entity): T {
      return classThis.resolveAttributes(
        new Entity(),
        attributes,
        stringEmptyToNull,
      );
    };
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

  public create<T>(entity: T) {
    // TODO: Log de atividade
    return this.repository.insert(entity);
  }
}
