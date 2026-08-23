import { TestAgent } from './auth';

export const defaultTag = {
  name: 'infra',
};

export async function createTag(
  agent: TestAgent,
  overrides: Partial<typeof defaultTag> = {}
) {
  const payload = { ...defaultTag, ...overrides };
  const response = await agent.post('/tags').send(payload);

  return { response, payload };
}
