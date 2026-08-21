import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  localUploadsDir: process.env.STORAGE_LOCAL_DIR ?? 'uploads',
  publicBaseUrl:
    process.env.STORAGE_PUBLIC_BASE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}/uploads`,
}));
