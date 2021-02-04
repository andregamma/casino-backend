import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
  Matches,
  IsNumber,
  IsBoolean,
} from 'class-validator';

/**
 * Patch Profile Payload Class
 */
export class PatchProfilePayload {
  /**
   * Email field
   */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  /**
   * Name field
   */
  @ApiProperty()
  @Matches(/^[a-zA-Z\wÀ-ú ]+$/)
  @IsNotEmpty()
  name: string;

  /**
   * Passport field
   */
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  passport: number;

  @ApiProperty({
    example: '257.26',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsBoolean()
  isPlaying: boolean;

  /**
   * Password field
   */
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
