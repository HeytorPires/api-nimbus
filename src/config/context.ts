import { AsyncLocalStorage } from 'node:async_hooks';

export interface IRequestContext {
  requestId: string;
  requestIp: string;
  userId?: string;
}

export const requestContext = new AsyncLocalStorage<IRequestContext>();
