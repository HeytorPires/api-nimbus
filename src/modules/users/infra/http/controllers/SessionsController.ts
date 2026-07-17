import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import RefreshTokenService from '../../../services/RefreshTokenService';
import LogoutService from '../../../services/LogoutService';
import { container } from 'tsyringe';
import { ICookieProvider } from '@shared/providers/cookie/models/ICookieProvider';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSessionsService = container.resolve(CreateSessionsService);
    const cookieProvider = container.resolve<ICookieProvider>('CookieProvider');

    const { accessToken, refreshToken, user } =
      await createSessionsService.execute({
        email,
        password,
      });

    cookieProvider.setAccessToken(response, accessToken);
    cookieProvider.setRefreshToken(response, refreshToken);

    return response.json({ user });
  }

  public async refresh(
    request: Request,
    response: Response
  ): Promise<Response> {
    const currentRefreshToken =
      request.cookies?.[authConfig.cookie.refreshToken.name];

    if (!currentRefreshToken) {
      throw new AppError(
        'Refresh token is missing. Please login again.',
        'SessionsController',
        401
      );
    }

    const cookieProvider = container.resolve<ICookieProvider>('CookieProvider');
    const refreshTokenService =
      container.resolve<RefreshTokenService>(RefreshTokenService);
    const { accessToken, refreshToken } =
      await refreshTokenService.execute(currentRefreshToken);

    cookieProvider.updateAccessToken(response, accessToken);
    cookieProvider.updateRefreshToken(response, refreshToken);

    return response.json({ accessToken });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const logoutService = container.resolve(LogoutService);
    const cookieProvider = container.resolve<ICookieProvider>('CookieProvider');

    await logoutService.execute(request.user.id);
    cookieProvider.clearAccessToken(response);
    cookieProvider.clearRefreshToken(response);

    return response.status(204).json();
  }
}

export default SessionsController;
