export interface IJWTProvider {
  sign(
    payload: string | object | Buffer,
    secret: string,
    options?: any
  ): string;
  verify(token: string, secret: string, options?: any): object | string;
}
