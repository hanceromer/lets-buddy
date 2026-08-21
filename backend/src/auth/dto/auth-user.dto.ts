import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: '9c1b1e4a-6e2d-4a3e-b3f1-c9a06e2d4a3e' })
  id: string;

  @ApiProperty({ example: 'kullanici@ornek.com' })
  email: string;

  @ApiProperty({ example: true })
  isEmailVerified: boolean;
}
