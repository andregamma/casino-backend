import moment from 'moment';
import { brFormat } from '../utils/dateUtils';

export function required(
  data: object,

  field: string,
  value: any,
): boolean {
  return typeof data[field] !== 'undefined';
}

export function array(
  data: object,

  field: string,
  value: any,
): boolean {
  if (typeof data[field] !== 'undefined') {
    return Array.isArray(data[field]);
  }

  return true;
}

export function isIn(
  data: object,

  field: string,
  value: any,
): boolean {
  if (typeof data[field] !== 'undefined') {
    const t = data[field];

    if (Array.isArray(t) || typeof t === 'string') {
      // Se tiver mais de um valor, vai verificar se T contém algum dos valores
      if (Array.isArray(value)) {
        for (const val of value) {
          if (t.includes(val)) {
            return true;
          }
        }

        return false;
      }

      return t.includes(value);
    }
  }

  return true;
}

export function inArray(
  data: object,

  field: string,
  value: any,
): boolean {
  if (typeof data[value] !== 'undefined') {
    const t = data[field];

    if (Array.isArray(t)) {
      return t.includes(value);
    }
  }

  return true;
}

export function alpha(
  data: object,

  field: string,
  value: any,
): boolean {
  if (typeof data[value] !== 'undefined') {
    if (data[value]) {
      const t = data[value];

      if (typeof t === 'string') {
        return !!t.match(/^[a-zA-Z]+$/);
      }

      return false;
    }

    return false;
  }

  return true;
}

export function alphanumeric(
  data: object,

  field: string,
  value: any,
) {
  if (typeof data[value] !== 'undefined') {
    if (data[value]) {
      const t = data[value];

      if (typeof t === 'string') {
        return t.match(/^[0-9a-zA-Z]+$/);
      }

      return false;
    }

    return false;
  }

  return true;
}

export function email(
  data: object,

  field: string,
  value: any,
): boolean {
  if (typeof data[field] !== 'undefined') {
    const t = data[field];

    if (typeof t === 'string') {
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        t,
      );
    }

    return false;
  }

  return true;
}

export function integer(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    if (typeof data[field] === 'number') {
      return Number.isInteger(data[field]);
    }

    return false;
  }

  return true;
}

export function json(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    if (typeof data[field] === 'string') {
      try {
        return !!JSON.parse(data[field]);
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  return true;
}

export function object(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    return typeof data[field] === 'object';
  }

  return true;
}

export function max(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    const t = data[field];

    if (typeof value === 'string') {
      value = Number(value);
    }

    if (typeof value !== 'number') {
      throw new Error(
        'É necessário passar um número no campo "max" -- back notice',
      );
    }

    if (Array.isArray(t) || typeof t === 'string') {
      return t.length <= value;
    }

    if (typeof t === 'number') {
      return t <= value;
    }
  }

  return true;
}

export function min(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    const t = data[field];

    if (typeof value === 'string') {
      value = Number(value);
    }

    if (typeof value !== 'number') {
      throw new Error(
        'É necessário passar um número no campo "min" -- back notice',
      );
    }

    if (Array.isArray(t) || typeof t === 'string') {
      return t.length >= value;
    }

    if (typeof t === 'number') {
      return t >= value;
    }
  }

  return true;
}

export function number(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    return typeof data[field] === 'number';
  }

  return true;
}

export function cantExist(data: object, field: string, value: any) {
  return typeof data[field] === 'undefined';
}

export function regex(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    if (Array.isArray(value)) {
      value = value.join('');
    }
  }

  if (typeof data[field] === 'number' || data[field] === 'string') {
    return data[field].match(value);
  }

  return true;
}

export async function unique(
  data: object,
  field: string,
  value: any,
  repository: any,
) {
  if (!repository) {
    throw new Error('Não foi passado nenhum repository');
  }

  if (typeof data[field] !== 'undefined') {
    if (!data[field]) {
      return false;
    }

    const t = data[field];

    if (typeof value === 'string') {
      const f = await repository.find({
        where: {
          [value]: t,
        },
      });

      return f.length < 1;
    }

    throw new Error('"unique" deve ser no modelo: "unique:column"');
  }

  return true;
}

export function string(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    return typeof data[field] === 'string';
  }

  return true;
}

export function date(data: object, field: string, value: any) {
  if (typeof data[field] !== 'undefined') {
    const t = data[field];
    if (value) {
      if (Array.isArray(value)) {
        const [locale, format] = value;

        return moment(t, format).isValid();
      }

      if (value === 'br') {
        return moment(t, brFormat).isValid();
      }
    }

    try {
      const date = new Date(t);
      return moment(date).isValid();
    } catch (e) {
      return false;
    }
  }

  return true;
}

export function any(data: object, field: string, value) {
  return true;
}

export function nullable(data: object, field: string, value) {
  if (
    typeof data[field] !== 'undefined' &&
    (data[field] === null || data[field] === '')
  ) {
    return true;
  }
  return false;
}
