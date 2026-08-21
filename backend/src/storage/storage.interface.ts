export interface UploadableFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

/**
 * Depolama detayına (yerel disk, S3 vb.) bağımlı olmayan ortak arayüz.
 * İleride S3 gibi bulut depolamaya geçerken sadece bu arayüzü implemente
 * eden yeni bir servis yazıp STORAGE_SERVICE provider'ını değiştirmek yeterli.
 */
export interface StorageService {
  upload(file: UploadableFile, folder: string): Promise<string>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
