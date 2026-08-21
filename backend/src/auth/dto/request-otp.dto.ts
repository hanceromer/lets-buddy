import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: 'kullanici@ornek.com' })
  @IsEmail()
  email: string;
}
