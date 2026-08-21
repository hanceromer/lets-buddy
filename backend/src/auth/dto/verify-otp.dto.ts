import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'kullanici@ornek.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{4,8}$/, { message: 'code sayısal ve 4-8 haneli olmalı' })
  code: string;
}
