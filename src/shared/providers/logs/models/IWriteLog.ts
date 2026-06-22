export interface IWriteLog {
  message: string;
  context?: string;
  requestId?: string;
  requestIp?: string;
  metadata?: Record<string, unknown>;
}
