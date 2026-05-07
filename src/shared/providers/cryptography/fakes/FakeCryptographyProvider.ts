import { ICryptographyProvider } from '../models/ICryptographyProvider';

export default class FakeCryptographyProvider implements ICryptographyProvider {
  public async encrypt(
    payload: string
  ): Promise<{ iv: string; content: string }> {
    return {
      iv: 'fake-iv',
      content: `encrypted:${payload}`,
    };
  }

  public async decrypt(payload: {
    iv: string;
    content: string;
  }): Promise<string> {
    if (payload.content.startsWith('encrypted:')) {
      return payload.content.slice('encrypted:'.length);
    }

    return payload.content;
  }
}
