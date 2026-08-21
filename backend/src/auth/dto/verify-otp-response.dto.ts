import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class VerifyOtpResponseDto {
  @ApiProperty({
    description:
      'Sonraki isteklerde "Authorization: Bearer <accessToken>" başlığı olarak kullanılmalı.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
