import { ILogProvider } from '../models/ILogProvider';
import { IWriteLog } from '../models/IWriteLog';
import pino, { Logger } from 'pino';

export default class PinoProvider implements ILogProvider {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino({
      level: 'debug',
      ...(process.env.NODE_ENV !== 'production' && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      }),
    });
  }

  error({ message, ...meta }: IWriteLog): void {
    this.logger.error({ level: 'ERROR', ...meta }, message);
  }

  warn({ message, ...meta }: IWriteLog): void {
    this.logger.warn({ level: 'WARN', ...meta }, message);
  }

  info({ message, ...meta }: IWriteLog): void {
    this.logger.info({ level: 'INFO', ...meta }, message);
  }

  debug({ message, ...meta }: IWriteLog): void {
    this.logger.debug({ level: 'DEBUG', ...meta }, message);
  }
}
