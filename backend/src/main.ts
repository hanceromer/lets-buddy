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
    .setDescription("Let's Buddy backend API sözleşmesi")
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
