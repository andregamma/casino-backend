import moment from 'moment';

export const brFormat = 'DD/MM/YYYY HH:mm:ss';
export const usFormat = 'YYYY-MM-DD HH:mm:ss';

export function brToUS(date: string, asMoment = false): string | moment.Moment {
  const m = moment(date, 'DD/MM/YYYY HH:mm:ss');
  if (asMoment) {
    return m;
  }

  return m.format(usFormat);
}

export function usToBr(date: string, asMoment = false): string | moment.Moment {
  const m = moment(date);
  if (asMoment) {
    return m;
  }

  return m.format(brFormat);
}

export function isBiggerThan(
  date: string,
  toCompare: string,
  formats = [brFormat, brFormat],
) {
  try {
    const [initialFormat, finalFormat] = formats;

    const final = moment(toCompare, finalFormat);

    return moment(date, initialFormat).isAfter(final);
  } catch (e) {
    return false;
  }
}

export function isSmallerThan(
  date: string,
  toCompare: string,
  formats = [brFormat, brFormat],
) {
  try {
    const [initialFormat, finalFormat] = formats;

    const final = moment(toCompare, finalFormat);

    return moment(date, initialFormat).isBefore(final);
  } catch (e) {
    return false;
  }
}

export function isBiggerThanToday(date: string, format = brFormat) {
  try {
    return moment(date, format).isAfter(new Date());
  } catch (e) {
    return false;
  }
}

export const compareDate = {
  isBiggerThan,
  isSmallerThan,
  isBiggerThanToday,
};

export const convertDate = {
  brToUS,
  usToBr,
};
