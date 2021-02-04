import { SetMetadata } from '@nestjs/common';

export const NotAuth = () => SetMetadata('not-auth', true);
