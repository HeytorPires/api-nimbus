import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IWriteLog } from '@shared/providers/logs/models/IWriteLog';

export default class FakeLogProvider implements ILogProvider {
  error(_log: IWriteLog): void {}
  warn(_log: IWriteLog): void {}
  info(_log: IWriteLog): void {}
  debug(_log: IWriteLog): void {}
}
