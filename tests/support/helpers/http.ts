import request from 'supertest';
import type { Express } from 'express';

/** UUID válido que não existe em nenhuma tabela. */
export const missingUuid = '00000000-0000-4000-8000-000000000000';

/** Requisição sem nenhum cookie de sessão. */
export function anonymous(app: Express) {
  return request(app);
}
