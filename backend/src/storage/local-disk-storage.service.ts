import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService, UploadableFile } from './storage.interface';

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/**
 * MVP için dosyaları sunucu diskine yazar ve statik olarak servis edilen
 * bir URL döner (bkz. main.ts -> app.useStaticAssets). Prod'a geçerken
 * S3StorageService gibi StorageService'i implemente eden bir sınıfla
 * değiştirilmesi yeterlidir (bkz. storage.module.ts).
 */
@Injectable()
export class LocalDiskStorageService implements StorageService {
  constructor(private readonly configService: ConfigService) {}

  async upload(file: UploadableFile, folder: string): Promise<string> {
    const uploadsRoot = this.configService.get<string>(
      'storage.localUploadsDir',
      'uploads',
    );
    const targetDir = join(process.cwd(), uploadsRoot, folder);
    await mkdir(targetDir, { recursive: true });

    const extension =
      extname(file.originalName) || EXTENSION_BY_MIME_TYPE[file.mimeType] || '';
    const filename = `${randomUUID()}${extension}`;
    await writeFile(join(targetDir, filename), file.buffer);

    const publicBaseUrl = this.configService.get<string>(
      'storage.publicBaseUrl',
      '/uploads',
    );
    return `${publicBaseUrl}/${folder}/${filename}`;
  }
}
