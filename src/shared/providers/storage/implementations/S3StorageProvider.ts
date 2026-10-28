import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import LogProvider from '@shared/providers/logs/implementations/LogProvider';
import { IStorageProvider } from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly tmpFolder: string;

  constructor() {
    const protocol = process.env.S3_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.S3_ENDPOINT || 'localhost';
    const port = Number(process.env.S3_PORT) || 9000;

    this.client = new S3Client({
      endpoint: `${protocol}://${host}:${port}`,
      region: process.env.S3_REGION || 'us-east-1',
      // servidores S3 próprios (RustFS, etc.) não resolvem bucket como subdomínio
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      // o SDK novo manda checksum CRC32 por padrão; só enviar quando o servidor exigir
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });

    this.bucket = process.env.S3_BUCKET || 'nimbus';
    this.tmpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads'
    );

    this.ensureBucket().catch((error: Error) => {
      new LogProvider().error({
        message: 'Failed to ensure storage bucket',
        context: 'S3StorageProvider',
        metadata: { bucket: this.bucket, error: error.message },
      });
    });
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (error) {
      if ((error as Error).name !== 'NotFound') {
        throw error;
      }

      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  public async getFileUrl(file: string): Promise<string> {
    return `${process.env.APP_API_URL}/files/${file}`;
  }

  public async saveFile(file: string, folder?: string): Promise<string> {
    const originalPath = path.resolve(this.tmpFolder, file);
    const objectName = folder ? `${folder}/${file}` : file;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectName,
        Body: fs.createReadStream(originalPath),
        ContentLength: (await fs.promises.stat(originalPath)).size,
      })
    );

    await fs.promises.unlink(originalPath);

    return objectName;
  }

  public async deleteFile(file: string, folder?: string): Promise<void> {
    const objectName = folder ? `${folder}/${file}` : file;

    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: objectName })
    );
  }

  public async getFileStream(file: string): Promise<Readable> {
    const { Body } = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: file })
    );

    return Body as Readable;
  }
}
