import path from 'node:path';
import fs from 'node:fs';
import { Readable } from 'node:stream';

import { IStorageProvider } from '../models/IStorageProvider';

const uploadsFolder = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'uploads'
);

fs.mkdirSync(uploadsFolder, { recursive: true });

export default class LocalStorageProvider implements IStorageProvider {
  private readonly tmpFolder: string;

  constructor() {
    this.tmpFolder = uploadsFolder;
  }
  public async saveFile(file: string, folder?: string): Promise<string> {
    const fileName = folder ? `${folder}/${file}` : file;

    await fs.promises.rename(
      path.resolve(this.tmpFolder, file),
      path.resolve(this.tmpFolder, fileName)
    );

    return fileName;
  }

  public async deleteFile(file: string, folder?: string): Promise<void> {
    const fileName = folder ? `${folder}/${file}` : file;

    const filePath = path.resolve(this.tmpFolder, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

  public async getFileUrl(file: string): Promise<string> {
    return `${process.env.APP_API_URL}/files/${file}`;
  }

  public async getFileStream(file: string): Promise<Readable> {
    const filePath = path.resolve(this.tmpFolder, file);
    return fs.createReadStream(filePath);
  }
}
