import { Injectable, Logger } from '@nestjs/common';

/**
 * Gerçek bir e-posta sağlayıcısı (SendGrid/SES/SMTP vb.) entegre edilene
 * kadar OTP kodu sadece log'a yazılır.
 */
@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  sendOtpEmail(email: string, code: string): void {
    this.logger.log(`OTP kodu (${email}): ${code}`);
  }
}
