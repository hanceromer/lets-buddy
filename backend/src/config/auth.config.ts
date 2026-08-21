import { registerAs } from '@nestjs/config';

/**
 * AUTH_ALLOWED_EMAIL_DOMAINS boşsa (varsayılan) herhangi bir e-posta adresiyle
 * kayıt/doğrulama yapılabilir. Belirli domainlerle kısıtlamak için virgülle
 * ayrılmış liste verin, örn: "ornek.edu.tr,.edu.tr" — ".edu.tr" gibi bir
 * girdi, o uzantıyla biten tüm domainleri (alt domainler dahil) kapsar.
 */
export default registerAs('auth', () => ({
  allowedEmailDomains: (process.env.AUTH_ALLOWED_EMAIL_DOMAINS ?? '')
    .split(',')
    .map((domain) => domain.trim().toLowerCase().replace(/^\.+/, ''))
    .filter((domain) => domain.length > 0),
  otpLength: Number(process.env.AUTH_OTP_LENGTH ?? 6),
  otpExpiryMinutes: Number(process.env.AUTH_OTP_EXPIRY_MINUTES ?? 10),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
}));
