import { sign, verify } from 'jsonwebtoken';
import { IJWTProvider } from '../models/IJWTProvider';

export default class JsonWebTokenProvider implements IJWTProvider {
  public sign(
    payload: string | object | Buffer,
    secret: string,
    options?: any
  ): string {
    return sign(payload, secret, options);
  }

  public verify(token: string, secret: string, options?: any): object | string {
    return verify(token, secret, options);
  }
}
