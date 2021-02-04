import {
  alpha,
  alphanumeric,
  array,
  email,
  inArray,
  integer,
  isIn,
  json,
  max,
  min,
  number,
  regex,
  required,
  object,
  string,
  unique,
  cantExist,
  any,
  date,
  nullable,
} from './RuleFunctions';

import { ruleMessages } from './RuleMessages';

export class RuleValidator {
  protected rules = {
    required,
    array,
    alpha,
    alphanumeric,
    email,
    isIn,
    inArray,
    integer,
    json,
    max,
    min,
    number,
    regex,
    string,
    object,
    unique,
    cantExist,
    date,
    any,
    nullable,
  };

  protected ruleMessages = ruleMessages;

  get availableRules(): string[] {
    const { rules } = this;
    return Object.keys(rules) as Array<keyof typeof rules>;
  }

  protected getFunctionToValidate(option: string): Function | boolean {
    if (this.availableRules.includes(option)) {
      return this.rules[option];
    }

    return false;
  }

  protected getErrorMessage(field: string, option: string, value: any) {
    if (this.ruleMessages[option]) {
      return this.transformErrorMessage(field, option, value);
    }

    return 'Mensagem de erro não definida';
  }

  private transformErrorMessage(field: string, option: string, value: any) {
    const errorMessage: string = this.ruleMessages[option];
    if (Array.isArray(value)) {
      value = value.join(', ');
    }

    return errorMessage.replace('{field}', field).replace('{value}', value);
  }

  protected async validate<T>(
    data: object,
    option: string,
    field: string,
    value: any,
    repository: any,
  ) {
    const fn = this.getFunctionToValidate(option);

    if (typeof fn === 'function') {
      const res = await fn(data, field, value, repository);

      return res;
    }

    return false;
  }
}
