import { IJWTProvider } from '@shared/providers/jwt/models/IJWTProvider';

interface IFakeTokenPayload {
  sub?: string;
  jti?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export default class FakeJWTProvider implements IJWTProvider {
  public sign(
    payload: string | object | Buffer,
    secret: string,
    options?: any
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const subject = options?.subject;

    const normalizedPayload: IFakeTokenPayload = {
      ...(typeof payload === 'object'
        ? (payload as object)
        : { value: payload }),
      sub: subject,
      iat: now,
    };

    const tokenBody = Buffer.from(JSON.stringify(normalizedPayload)).toString(
      'base64'
    );
    const tokenSignature = Buffer.from(secret).toString('base64');

    return `${tokenBody}.${tokenSignature}`;
  }

  public verify(token: string, secret: string, options?: any): object | string {
    const [tokenBody, tokenSignature] = token.split('.');

    if (!tokenBody || !tokenSignature) {
      throw new Error('Invalid token');
    }

    const expectedSignature = Buffer.from(secret).toString('base64');

    if (tokenSignature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const payload = JSON.parse(
      Buffer.from(tokenBody, 'base64').toString('utf8')
    );

    if (options?.complete) {
      return { payload };
    }

    return payload;
  }
}
