import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  jti?: string;
}
export default async function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT toker is missing', 'isAuthenticated', 401);
  }
  //bearer dsadadadlskadihdih43248hahdsadhasda
  const [, token] = authHeader.split(' ');
  const { secret } = authConfig.jwt;
  try {
    const decodedToken = verify(token, secret);
    const { sub, jti } = decodedToken as ITokenPayload;

    if (jti) {
      const cacheProvider = container.resolve<ICacheProvider>('CacheProvider');
      let storedJti = await cacheProvider.recover<string>(`session:${sub}`);

      if (!storedJti) {
        const userTokensRepository = container.resolve<IUserTokensRepository>(
          'UsersTokensRepository'
        );
        const dbToken = await userTokensRepository.findByUserId(sub);
        storedJti = dbToken?.token ?? null;
      }

      if (!storedJti || storedJti !== jti) {
        throw new AppError('Session expired', 'isAuthenticated', 401);
      }
    }

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Invalid Token is missing', 'isAuthenticated', 401);
  }
}
