import { Readable } from 'node:stream';

export interface IStorageProvider {
  saveFile(file: string, folder?: string): Promise<string>;
  deleteFile(file: string, folder?: string): Promise<void>;
  getFileUrl(file: string): Promise<string>;
  getFileStream(file: string): Promise<Readable>;
}
