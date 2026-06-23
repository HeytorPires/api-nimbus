import { Readable } from 'node:stream';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private readonly storage: string[] = [];

  async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const index = this.storage.indexOf(file);
    if (index > -1) this.storage.splice(index, 1);
  }

  async getFileUrl(file: string): Promise<string> {
    return `http://localhost:3333/files/${file}`;
  }

  async getFileStream(file: string): Promise<Readable> {
    return Readable.from(Buffer.from(`fake-content-${file}`));
  }
}
