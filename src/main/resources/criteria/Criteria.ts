import { Request } from 'express';
import {
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ObjectLiteral,
  Raw,
} from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { CriteriaBuilder } from './CriteriaBuilder';
import { BaseRepository } from '../../repositories/BaseRepository';
import { Transformer } from '../../transformers/Transformer';

export const availableFieldsSearchable = [
  '=',
  '<',
  '>',
  '>=',
  '<=',
  'LIKE',
  'LIKE_LEFT',
  'LIKE_RIGHT',
];

export interface CriteriaPagination {
  current: number;
  total: number;
  totalItems: number;
  perPage: number;
}

export interface CriteriaData<T> {
  data: T[];
  pagination: CriteriaPagination;
}

export interface FieldsSearchable {
  [field: string]:
    | '='
    | '<'
    | '>'
    | '>='
    | '<='
    | 'LIKE'
    | 'LIKE_LEFT'
    | 'LIKE_RIGHT'
    | 'IN'
    | Array<
        | '='
        | '<'
        | '>'
        | '>='
        | '<='
        | 'LIKE'
        | 'LIKE_LEFT'
        | 'LIKE_RIGHT'
        | 'IN'
      >;
}

export class Criteria<T> extends CriteriaBuilder<T> {
  constructor(
    protected Entity: new () => T,
    protected repository: Partial<BaseRepository<T>>,
    protected readonly request: Request,
  ) {
    super();
    this.buildBody();
  }

  public async get(): Promise<
    CriteriaData<Transformer<T, any>> | CriteriaData<T>
  > {
    await this.constructData();

    const data = await this.repository.find(this.data);

    return this.transform(this.useTransformer, data);
  }

  public withTransformer<Options>(
    transformer: Transformer<T, Options>,
    options: Options,
  ) {
    this.useTransformer = true;
    this.transformer = transformer;
    this.transformerOptions = options;

    return this;
  }

  public setDefaultOrderSort(order: 'ASC' | 'DESC') {
    this.defaultOrderSort = order;
  }

  public setFieldsSearchable(fieldsSearchable: FieldsSearchable) {
    this.fieldsSearchable = fieldsSearchable;
    return this;
  }

  public relations(relations: string[]) {
    this.data.relations = relations;
    return this;
  }

  public where(
    where: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string,
  ) {
    this.data.where = where;
    return this;
  }

  /**
   * Se vai buscar com 'AND' ou 'OR' (true, false)
   * @param join
   * @return Criteria
   */
  public filterJoin(join = true) {
    this.searchJoin = true;
    return this;
  }

  private async constructData() {
    this.generateOrder();
    this.generatePagination();
    this.generateFilter();
    await this.generateCount();
  }

  private generatePagination() {
    const { page: getPage, take: getTake } = this.body;

    const page = Number.parseInt(getPage, 10) || false;
    const take = Number.parseInt(getTake, 10) || false;

    let currentPage = 1;
    const values = { skip: 0, take: 10 };

    if (page) {
      currentPage = Math.round(page);

      if (currentPage < 1) {
        currentPage = 1;
      }
    }

    if (take) {
      values.take = take;
    }

    values.skip = currentPage * values.take - values.take;
    Object.assign(this.pagination, {
      current: currentPage,
      perPage: values.take,
    });
    Object.assign(this.data, values);
  }

  private generateFilter() {
    const { filter } = this.body;

    if (filter) {
      const where = [];

      if (typeof filter === 'object') {
        const keys = Object.keys(filter);

        for (const field of keys) {
          if (this.fieldsSearchable[field]) {
            let comparator = this.fieldsSearchable[field];
            let value = filter[field];

            // Garantir que sempre que o valor for uma array vai fazer uma busca "IN", caso seja permitido no "FieldsSearchable"
            if (Array.isArray(value)) {
              if (comparator.includes('IN')) {
                comparator = 'IN';
              }
            } else {
              // Se for permitido mais de um valor em "FieldsSearchable"
              // Valida se o comparador é valido e o adiciona como comparador, se não, o comparador vai ser "="
              if (Array.isArray(comparator)) {
                const [realValue, realComparator] = value.split(':');

                if (availableFieldsSearchable.includes(realComparator)) {
                  comparator = realComparator;
                } else {
                  comparator = '=';
                }

                value = realValue;
              } else if (value.includes(':')) {
                // eslint-disable-next-line prefer-destructuring
                const realValue = value.split(':')[0];

                value = Number(realValue) || realValue;
              }
            }

            let whereToAdd;

            switch (comparator) {
              case '>':
                whereToAdd = { [field]: MoreThan(value) };
                break;
              case '>=':
                whereToAdd = { [field]: MoreThanOrEqual(value) };
                break;
              case '<':
                whereToAdd = { [field]: LessThan(value) };
                break;
              case '<=':
                whereToAdd = { [field]: LessThanOrEqual(value) };
                break;
              case 'LIKE':
                whereToAdd = {
                  [field]: Raw(
                    (alias) => `${alias} ILIKE '%${value.toString().trim()}%'`,
                  ),
                };
                break;
              case 'LIKE_LEFT':
                whereToAdd = {
                  [field]: Raw(
                    (alias) => `${alias} ILIKE '%${value.toString().trim()}'`,
                  ),
                };
                break;
              case 'LIKE_RIGHT':
                whereToAdd = {
                  [field]: Raw(
                    (alias) => `${alias} ILIKE '${value.toString().trim()}%'`,
                  ),
                };
                break;
              case 'IN':
                if (!Array.isArray(value)) {
                  value = [value];
                }

                whereToAdd = { [field]: In(value) };
                break;
              default:
                whereToAdd = { [field]: value };
            }

            if (this.searchJoin) {
              if (where.length > 0) {
                where[0] = { ...where[0], ...whereToAdd };
              } else {
                where.push(whereToAdd);
              }
            } else {
              where.push(whereToAdd);
            }
          }
        }

        if (this.data.where) {
          this.data.where = this.data.where.concat(where);
        } else {
          this.data.where = where;
        }
      }
    }
  }

  private generateOrder() {
    const { orderBy } = this.body;

    if (typeof orderBy === 'string') {
      const [field, value] = orderBy.split(':');
      const availableValues = ['ASC', 'DESC'];

      let realValue: 'ASC' | 'DESC' = 'DESC';

      if (value) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        realValue = value.toUpperCase();

        realValue = availableValues.includes(realValue)
          ? realValue
          : this.defaultOrderSort;
      }

      this.data.order = {
        [field]: realValue,
      };
    }
  }

  private async generateCount() {
    const data = { ...this.data };

    // Remove as limitações da paginação para trazer a contagem total dos dados
    if (data.take) {
      delete data.take;
    }

    if (data.skip) {
      delete data.skip;
    }

    const total = await this.repository.count(this.data);
    let totalPages = Math.round(total / this.pagination.perPage);

    // Se ele for um numero flutuante e arredondar para o menor valor, acrescenter uma nova página para carregar os valores quebrados
    if (totalPages * this.pagination.perPage < total) {
      totalPages++;
    }

    Object.assign(this.pagination, { totalItems: total, total: totalPages });
  }

  private get body() {
    if (this.request?.body && this.request?.query && this.request.method) {
      const { body, method } = this.request;

      if (method.toUpperCase() === 'GET') {
        return this.criteriaBody;
      }

      return body;
    }

    return this.criteriaBody;
  }
}
