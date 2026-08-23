import fs from 'node:fs';
import path from 'node:path';

/**
 * Pasta onde o LocalStorageProvider e o multer gravam (<root>/uploads).
 * É a mesma pasta do ambiente de desenvolvimento: os testes removem apenas os
 * arquivos cujos nomes eles próprios capturaram, nunca a pasta inteira.
 */
export const uploadsFolder = path.resolve(process.cwd(), 'uploads');

/** PNG 1x1 em memória, para não versionar binário no repositório. */
export function pngFixture(): Buffer {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/wD/AAoAAAAASUVORK5CYII=',
    'base64'
  );
}

export function uploadPath(file: string): string {
  return path.resolve(uploadsFolder, file);
}

export function uploadExists(file: string): boolean {
  return fs.existsSync(uploadPath(file));
}

/** Extrai o nome do arquivo de uma avatarUrl (`${APP_API_URL}/files/<nome>`). */
export function fileNameFromUrl(url: string): string {
  return url.split('/files/')[1];
}

/** Remove um upload criado pelo teste, tolerando ausência. */
export async function removeUpload(file?: string): Promise<void> {
  if (!file) return;

  try {
    await fs.promises.unlink(uploadPath(file));
  } catch {
    // arquivo já removido pelo próprio service (troca de avatar)
  }
}
