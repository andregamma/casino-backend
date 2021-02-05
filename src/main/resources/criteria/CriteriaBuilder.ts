import { FindManyOptions } from 'typeorm';
import { Request } from 'express';
import { CriteriaData, CriteriaPagination, FieldsSearchable } from './Criteria';
import { getQuery } from '../decorators/Query';
import { BaseRepository } from '../../repositories/BaseRepository';
import { Transformer } from '../../transformers/Transformer';

export interface CriteriaBody {
  page?: number;
  take?: number;
  orderBy?: string;
  filter?: { [key: string]: number | string };
}

export class CriteriaBuilder<T> {
  protected data: FindManyOptions = {
    skip: 0,
    take: 10,
  };

  protected Entity: new () => T;

  protected repository: Partial<BaseRepository<T>>;

  protected availableCriteriaFields = ['page', 'orderBy', 'filter', 'take'];

  protected availableComparators = ['=', '<', '>', '>=', '<=', 'LIKE', 'IN'];

  protected defaultOrderSort: 'DESC' | 'ASC' = 'DESC';

  protected fieldsSearchable: FieldsSearchable = {};

  protected criteriaBody: CriteriaBody = {};

  protected readonly request: Request;

  protected useTransformer = false;

  protected transformer?: Transformer<T, any>;

  protected transformerOptions?: any;

  // Se vai buscar com 'AND' ou 'OR' (true, false)
  protected searchJoin = true;

  protected pagination: CriteriaPagination = {
    current: 1,
    total: 1,
    totalItems: 0,
    perPage: 10,
  };

  protected buildBody() {
    const querys = getQuery(this.request);

    Object.keys(querys).forEach((field) => {
      if (this.availableCriteriaFields.includes(field)) {
        this.generateCriteriaField(field, querys);
      }
    });
  }

  private generateCriteriaField(field: string, querys: any) {
    // eslint-disable-next-line default-case
    switch (field) {
      case 'page':
        this.criteriaBody.page = Number.parseInt(querys.page, 10);
        break;
      case 'take':
        this.criteriaBody.take = Number.parseInt(querys.take, 10);
        break;
      case 'orderBy':
        this.criteriaBody.orderBy = querys.orderBy;
        break;
      case 'filter':
        this.criteriaBody.filter = this.generateFilterFromString(querys.filter);
    }
  }

  protected generateFilterFromString(
    str: string,
  ): { [key: string]: number | string } {
    const filters = str.split(';');
    const data = {};
    let realValue;

    const setValue = (value, comparator?) => {
      if (Array.isArray(value)) {
        const newArray = [];

        // Re-adiciona como número ou string
        value.forEach((realValue) => {
          realValue = realValue.trim();

          const inNumber = Number(realValue);
          if (!Number.isNaN(inNumber)) {
            newArray.push(inNumber);
          } else {
            realValue = realValue.toString();
            newArray.push(realValue);
          }
        });

        realValue = newArray;
      } else {
        if (comparator) {
          if (!this.availableComparators.includes(comparator)) {
            comparator = '=';
          }
        }

        realValue = `${Number(value) || value.toString()}:${comparator || '='}`;
      }
    };

    filters.forEach((filter) => {
      if (filter.includes(':')) {
        const [field, value] = filter.split(':');

        if (filter.includes(',')) {
          const values = value.split(',');

          setValue(values);
        } else {
          // Se não for um número, vai passar como string
          setValue(value);

          if (value.includes('|')) {
            const [value2, comparator] = value.split('|');
            setValue(value2, comparator);
          }
        }

        data[field] = realValue;
      }
    });

    return data;
  }

  protected generateInField(
    values: Array<string | number>,
    field: string,
  ): T[] {
    const entities: T[] = [];

    values.forEach((value) => {
      const entity = this.buildEntity();
      if (entity) {
        entity[field] = value;
        entities.push(entity);
      }
    });

    return entities;
  }

  protected buildEntity(): T | false {
    try {
      // @ts-ignore
      return new this.Entity();
    } catch (e) {
      return false;
    }
  }

  public transform(
    transform: boolean,
    entityData: T[],
  ): CriteriaData<Transformer<T, any>> | CriteriaData<T> {
    if (transform) {
      const transformed = [];

      entityData.forEach((data) => {
        transformed.push(
          this.transformer.transform(data, this.transformerOptions),
        );
      });

      return { data: transformed, pagination: this.pagination };
    }

    return { data: entityData, pagination: this.pagination };
  }
}
