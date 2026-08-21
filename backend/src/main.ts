import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const uploadsDir = configService.get<string>(
    'storage.localUploadsDir',
    'uploads',
  );
  app.useStaticAssets(join(process.cwd(), uploadsDir), {
    prefix: '/uploads',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Let's Buddy API")
    .setDescription(
      "Let's Buddy backend API sözleşmesi — frontend ile ortak referans.\n\n" +
        'Kimlik doğrulama: /auth/otp/verify çağrısından dönen accessToken, ' +
        'korumalı endpoint\'lerde "Authorization: Bearer <accessToken>" ' +
        "başlığı olarak gönderilmeli (aşağıdaki 'Authorize' butonu ile " +
        'tek seferde ayarlanabilir).\n\n' +
        'Gerçek zamanlı mesajlaşma (Socket.io) bu dokümanın kapsamında ' +
        "değildir; sözleşmesi 'messages' bölümündeki mesaj geçmişi " +
        'endpoint açıklamasında anlatılmıştır.',
    )
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('auth', 'Üniversite/normal e-posta ile OTP kayıt ve doğrulama')
    .addTag('profiles', 'Profil oluşturma, güncelleme ve fotoğraf yükleme')
    .addTag('swipes', 'Kategori bazlı kaydırma (beğen/geç) ve otomatik eşleşme')
    .addTag(
      'messages',
      'Eşleşme sonrası mesaj geçmişi (gerçek zamanlı akış Socket.io ile)',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
