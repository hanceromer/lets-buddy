import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(
      new BadRequestException(
        'Sadece jpeg, png veya webp formatında görsel yüklenebilir.',
      ),
      false,
    );
    return;
  }
  callback(null, true);
}
