import request from 'supertest';
import { getRepository } from 'typeorm';
import type { Express } from 'express';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { redisClient } from '../setup/database';

export type TestAgent = ReturnType<typeof request.agent>;

export const defaultCredentials = {
  name: 'Integration User',
  email: 'integration@nimbus.dev',
  password: 'secret123',
};

export async function createUser(
  app: Express,
  overrides: Partial<typeof defaultCredentials> = {}
) {
  const payload = { ...defaultCredentials, ...overrides };
  const response = await request(app).post('/users').send(payload);

  return { response, payload };
}

export async function login(
  agent: TestAgent,
  credentials: { email: string; password: string }
) {
  return agent.post('/sessions').send(credentials);
}

export async function authenticatedAgent(
  app: Express,
  overrides: Partial<typeof defaultCredentials> = {}
) {
  const { payload } = await createUser(app, overrides);
  const agent = request.agent(app);
  const session = await login(agent, {
    email: payload.email,
    password: payload.password,
  });

  return { agent, session, user: session.body.user, payload };
}

export async function otherUserAgent(app: Express) {
  return authenticatedAgent(app, {
    name: 'Other User',
    email: 'other@nimbus.dev',
    password: 'secret456',
  });
}

export async function findUserTokens(userId: string): Promise<UserToken[]> {
  return getRepository(UserToken).find({
    where: { userId: userId },
    order: { createdAt: 'DESC' },
  });
}

export async function findCachedSession(
  userId: string
): Promise<string | null> {
  const raw = await redisClient().get(`session:${userId}`);

  return raw ? (JSON.parse(raw) as string) : null;
}

export function getSetCookie(
  response: request.Response,
  name: string
): string | undefined {
  const header = response.headers['set-cookie'] as unknown as
    | string[]
    | undefined;

  return header?.find((cookie) => cookie.startsWith(`${name}=`));
}
