import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpResponseDto } from './dto/request-otp-response.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'E-posta adresine OTP doğrulama kodu gönderir',
    description:
      'Kullanıcı yoksa otomatik oluşturulur. AUTH_ALLOWED_EMAIL_DOMAINS ' +
      'ayarlıysa sadece izinli domainler kabul edilir.',
  })
  @ApiResponse({
    status: 200,
    description: 'Kod üretildi ve (log/e-posta ile) gönderildi.',
    type: RequestOtpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz e-posta formatı.' })
  @ApiResponse({
    status: 403,
    description: 'Bu e-posta alan adıyla kayıt desteklenmiyor.',
  })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.email);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'OTP kodunu doğrular ve erişim token’ı döner',
  })
  @ApiResponse({
    status: 200,
    description: 'Kod doğru, hesap doğrulandı ve accessToken üretildi.',
    type: VerifyOtpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz istek gövdesi.' })
  @ApiResponse({
    status: 401,
    description:
      'Kod bulunamadı, süresi doldu ya da hatalı (mesaj alanında ayrım yapılır).',
  })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }
}
