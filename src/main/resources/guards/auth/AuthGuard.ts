import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const notAuth = this.reflector.get<string[]>(
      'not-auth',
      context.getHandler(),
    );

    if (notAuth) {
      return true;
    }

    const auth = req.headers.authorization;

    if (!auth) {
      return false;
    }

    const [, token] = auth.split(' ');

    try {
      // @ts-ignore
      await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }
}
