/* eslint-disable no-underscore-dangle */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function getQuery(req, data?: string): Record<string, any> {
  const queryString = req._parsedUrl.query;

  const query = {};
  const pairs =
    queryString && queryString[0] === '?'
      ? queryString.substr(1).split('&')
      : queryString
      ? queryString.split('&')
      : {};
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  if (data && query[data] !== 'undefined') {
    return query[data];
  }
  return query;
}

export const Query = createParamDecorator(
  async (data: any, context: ExecutionContext) => {
    return getQuery(context.switchToHttp().getRequest(), data);
  },
);
