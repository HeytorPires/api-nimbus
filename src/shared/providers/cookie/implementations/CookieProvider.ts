import { Response, CookieOptions } from 'express';
import { ICookieProvider } from '../models/ICookieProvider';
import authConfig from '@config/auth';

export default class CookieProvider implements ICookieProvider {
  private getRefreshTokenCookieOptions(): CookieOptions {
    const { httpOnly, secure, sameSite, path, maxAge } =
      authConfig.cookie.refreshToken;

    return {
      httpOnly,
      secure,
      sameSite,
      path,
      maxAge: maxAge * 1000,
    };
  }

  private getAccessTokenCookieOptions(): CookieOptions {
    const { httpOnly, secure, sameSite, path, maxAge } =
      authConfig.cookie.accessToken;

    return {
      httpOnly,
      secure,
      sameSite,
      path,
      maxAge: maxAge * 1000,
    };
  }

  /** Define o cookie de Refresh Token na resposta HTTP. */
  setRefreshToken(response: Response, token: string): void {
    response.cookie(
      authConfig.cookie.refreshToken.name,
      token,
      this.getRefreshTokenCookieOptions()
    );
  }

  /** Atualiza o cookie de Refresh Token com um novo valor. */
  updateRefreshToken(response: Response, token: string): void {
    this.setRefreshToken(response, token);
  }

  /** Remove o cookie de Refresh Token da resposta HTTP. */
  clearRefreshToken(response: Response): void {
    response.clearCookie(authConfig.cookie.refreshToken.name, {
      httpOnly: authConfig.cookie.refreshToken.httpOnly,
      secure: authConfig.cookie.refreshToken.secure,
      sameSite: authConfig.cookie.refreshToken.sameSite,
      path: authConfig.cookie.refreshToken.path,
    });
  }

  /** Define o cookie de Access Token na resposta HTTP. */
  setAccessToken(response: Response, token: string): void {
    response.cookie(
      authConfig.cookie.accessToken.name,
      token,
      this.getAccessTokenCookieOptions()
    );
  }

  /** Atualiza o cookie de Access Token com um novo valor. */
  updateAccessToken(response: Response, token: string): void {
    this.setAccessToken(response, token);
  }

  /** Remove o cookie de Access Token da resposta HTTP. */
  clearAccessToken(response: Response): void {
    response.clearCookie(authConfig.cookie.accessToken.name, {
      httpOnly: authConfig.cookie.accessToken.httpOnly,
      secure: authConfig.cookie.accessToken.secure,
      sameSite: authConfig.cookie.accessToken.sameSite,
      path: authConfig.cookie.accessToken.path,
    });
  }
}
