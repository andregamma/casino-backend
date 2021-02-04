import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import Database from '../../config/database';

config();

@Module({
  imports: [TypeOrmModule.forRoot(Database)],
  exports: [TypeOrmModule],
})
export class TypeOrm {}
