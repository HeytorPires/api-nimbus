import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { Client } from 'minio';

import { IStorageProvider } from '../models/IStorageProvider';

export default class MinioStorageProvider implements IStorageProvider {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly tmpFolder: string;

  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
    });

    this.bucket = process.env.MINIO_BUCKET || 'nimbus';
    this.tmpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads'
    );

    this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  public async getFileUrl(file: string): Promise<string> {
    return `${process.env.APP_API_URL}/files/${file}`;
  }

  public async saveFile(file: string, folder?: string): Promise<string> {
    const originalPath = path.resolve(this.tmpFolder, file);
    const objectName = folder ? `${folder}/${file}` : file;

    await this.client.fPutObject(this.bucket, objectName, originalPath);

    await fs.promises.unlink(originalPath);

    return objectName;
  }

  public async deleteFile(file: string, folder?: string): Promise<void> {
    const objectName = folder ? `${folder}/${file}` : file;

    await this.client.removeObject(this.bucket, objectName);
  }

  public async getFileStream(file: string): Promise<Readable> {
    return (await this.client.getObject(this.bucket, file)) as Readable;
  }
}
