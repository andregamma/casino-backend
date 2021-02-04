import { RuleValidator } from './RuleValidator';
import { GenericsValidator } from './Generics';

export class Validator extends RuleValidator {
  private repository: any;

  private generic?: GenericsValidator;

  constructor(repository?: any) {
    super();

    if (repository) {
      this.repository = repository;
    }
  }

  public setRepository(repository: any) {
    this.repository = repository;
  }

  public addField(field: string, options: string[]): void {
    if (this.optionsAreValid(options)) {
      this.fields = {
        ...this.fields,
        [field]: options,
      };
    } else {
      this.fieldsNotAdded.push({
        field,
        options,
      });
    }
  }

  public addFields(fields: object) {
    (Object.keys(fields) as Array<keyof typeof fields>).forEach((key) => {
      const options: string[] = fields[key];

      this.addField(key, options);
    });

    return this;
  }

  public resetFields() {
    this.fields = {};

    return this;
  }

  public getFields(): string[] {
    const { fields } = this;
    return Object.keys(fields) as Array<keyof typeof fields>;
  }

  public getAvailableRules(): string[] {
    return this.availableRules;
  }

  public getFieldsNotAdded(): object[] {
    return this.fieldsNotAdded;
  }

  public get generics(): GenericsValidator {
    if (!this.generic) {
      this.generic = new GenericsValidator();
    }

    return this.generic;
  }

  public async passesOrFail<T>(data: object) {
    for (const field of this.getFields()) {
      const options: string[] = this.fields[field];

      for (const option of options) {
        const optionValue = this.getOptionValue(option);
        const realOption = this.getRealOption(option);
        const or = this.getOr(option);

        if (
          !(await this.validate(
            data,
            realOption,
            field,
            optionValue,
            this.repository,
          ))
        ) {
          if (
            typeof or === 'string' &&
            (await this.validate(data, or, field, optionValue, this.repository))
          ) {
            // eslint-disable-next-line no-continue
            continue;
          }
          throw new Error(this.getErrorMessage(field, realOption, optionValue));
        }
      }
    }
  }

  private getOptionValue(option: string): any {
    let values = option;
    if (option.includes('|')) {
      [values] = option.split('|');
    }
    if (values.includes(':')) {
      [, values] = values.split(':');

      if (values.includes(',')) {
        return values.split(',');
      }

      return values;
    }

    return '';
  }

  private optionsAreValid(options: string[]) {
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (!this.optionIsValid(option)) {
        return false;
      }
    }

    return true;
  }

  private getRealOption(option: string): string {
    if (option.includes('|')) {
      [option] = option.split('|');
    }
    if (option.includes(':')) {
      // eslint-disable-next-line prefer-destructuring
      return option.split(':')[0];
    }
    return option;
  }

  private getOr(option: string): string | boolean {
    if (option.includes(':')) {
      [, option] = option.split(':');
    }
    if (option.includes('|')) {
      [, option] = option.split('|');
      return option;
    }

    return false;
  }

  private optionIsValid(option: string): boolean {
    return this.availableRules.includes(this.getRealOption(option));
  }

  private fields: object = {};

  private fieldsNotAdded: object[] = [];
}
