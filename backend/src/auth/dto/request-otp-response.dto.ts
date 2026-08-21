import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestOtpResponseDto {
  @ApiProperty({ example: 'Doğrulama kodu e-posta adresinize gönderildi.' })
  message: string;

  @ApiPropertyOptional({
    description:
      'Gerçek bir e-posta sağlayıcısı entegre edilene kadar geliştirme/test ' +
      'kolaylığı için sadece prod dışı ortamlarda döner.',
    example: '482913',
  })
  debugOtp?: string;
}
