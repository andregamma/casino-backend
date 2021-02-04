import {
  IsAlphanumeric,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTableDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;

  @IsAlphanumeric()
  @IsOptional()
  password: string;

  @IsBoolean()
  active: boolean;
}
