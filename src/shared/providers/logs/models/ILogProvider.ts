import { IWriteLog } from './IWriteLog';

export interface ILogProvider {
  error: (log: IWriteLog) => void;
  warn: (log: IWriteLog) => void;
  info: (log: IWriteLog) => void;
  debug: (log: IWriteLog) => void;
}
