/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IWriteLog } from '@shared/providers/logs/models/IWriteLog';

export default class FakeLogProvider implements ILogProvider {
  error(log: IWriteLog): void {}
  warn(log: IWriteLog): void {}
  info(log: IWriteLog): void {}
  debug(log: IWriteLog): void {}
}
