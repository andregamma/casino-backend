import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';

export const userID = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) {
      return false;
    }

    const [, token] = auth.split(' ');

    try {
      const auth: any = await promisify(jwt.verify)(
        token,
        // @ts-ignore
        process.env.JWT_SECRET,
      );
      return auth.id;
    } catch (err) {
      return false;
    }
  },
);
