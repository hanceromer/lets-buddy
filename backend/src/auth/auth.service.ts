import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import { Repository } from 'typeorm';
import { MailerService } from '../mailer/mailer.service';
import { User } from '../users/entities/user.entity';

const OTP_HASH_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async requestOtp(rawEmail: string) {
    const email = this.normalizeEmail(rawEmail);

    if (!this.isEmailDomainAllowed(email)) {
      throw new ForbiddenException(
        'Bu e-posta alan adıyla kayıt şu anda desteklenmiyor.',
      );
    }

    let user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      user = this.usersRepository.create({ email });
    }

    const otpLength = this.configService.get<number>('auth.otpLength', 6);
    const otpExpiryMinutes = this.configService.get<number>(
      'auth.otpExpiryMinutes',
      10,
    );
    const code = this.generateOtpCode(otpLength);

    user.otpCodeHash = await bcrypt.hash(code, OTP_HASH_SALT_ROUNDS);
    user.otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60_000);
    await this.usersRepository.save(user);

    this.mailerService.sendOtpEmail(email, code);

    const isProduction =
      this.configService.get<string>('NODE_ENV', 'development') ===
      'production';

    return {
      message: 'Doğrulama kodu e-posta adresinize gönderildi.',
      // Gerçek e-posta gönderimi entegre edilene kadar geliştirme/test
      // kolaylığı için kod, prod dışı ortamlarda yanıtta da döner.
      ...(isProduction ? {} : { debugOtp: code }),
    };
  }

  async verifyOtp(rawEmail: string, code: string) {
    const email = this.normalizeEmail(rawEmail);

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.otpCodeHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user?.otpCodeHash || !user.otpExpiresAt) {
      throw new UnauthorizedException(
        'Doğrulama kodu bulunamadı, lütfen tekrar isteyin.',
      );
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException(
        'Doğrulama kodunun süresi doldu, lütfen tekrar isteyin.',
      );
    }

    const isValid = await bcrypt.compare(code, user.otpCodeHash);
    if (!isValid) {
      throw new UnauthorizedException('Doğrulama kodu hatalı.');
    }

    user.isEmailVerified = true;
    user.otpCodeHash = null;
    user.otpExpiresAt = null;
    await this.usersRepository.save(user);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isEmailDomainAllowed(email: string): boolean {
    const allowedDomains = this.configService.get<string[]>(
      'auth.allowedEmailDomains',
      [],
    );
    if (!allowedDomains || allowedDomains.length === 0) {
      return true;
    }

    const domain = email.split('@')[1];
    if (!domain) {
      return false;
    }

    return allowedDomains.some(
      (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
    );
  }

  private generateOtpCode(length: number): string {
    const max = 10 ** length;
    return randomInt(0, max).toString().padStart(length, '0');
  }
}
