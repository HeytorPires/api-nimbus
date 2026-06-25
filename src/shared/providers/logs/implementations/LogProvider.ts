import { ILogProvider } from '../models/ILogProvider';
import { IWriteLog } from '../models/IWriteLog';

export default class LogProvider implements ILogProvider {
  private writeLog(
    level: string,
    { message, context, requestId, requestIp, metadata }: IWriteLog
  ): void {
    const logLevel = process.env.LOG_LEVEL
      ? process.env.LOG_LEVEL.split(',')
      : [];

    if (logLevel.includes(level)) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level,
          message,
          context,
          requestId,
          requestIp,
          metadata,
        })
      );
    }
  }

  error(log: IWriteLog): void {
    this.writeLog('error', log);
  }

  warn(log: IWriteLog): void {
    this.writeLog('warn', log);
  }

  info(log: IWriteLog): void {
    this.writeLog('info', log);
  }

  debug(log: IWriteLog): void {
    this.writeLog('debug', log);
  }
}
