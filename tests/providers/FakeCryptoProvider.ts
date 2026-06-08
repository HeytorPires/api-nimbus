import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';

export default class FakeCryptoProvider implements ICryptographyProvider {
  public async encrypt(
    payload: string
  ): Promise<{ iv: string; content: string }> {
    return {
      iv: 'fake-iv',
      content: `encrypted-${payload}`,
    };
  }

  public async decrypt(payload: {
    iv: string;
    content: string;
  }): Promise<string> {
    return payload.content.replace('encrypted-', '');
  }
}
