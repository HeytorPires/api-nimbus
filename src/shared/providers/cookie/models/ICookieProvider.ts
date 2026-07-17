import { Response } from 'express';

export interface ICookieProvider {
  /** Define o cookie de Refresh Token na resposta HTTP. */
  setRefreshToken(response: Response, token: string): void;

  /** Atualiza o cookie de Refresh Token com um novo valor. */
  updateRefreshToken(response: Response, token: string): void;

  /** Remove o cookie de Refresh Token da resposta HTTP. */
  clearRefreshToken(response: Response): void;

  /** Define o cookie de Access Token na resposta HTTP. */
  setAccessToken(response: Response, token: string): void;

  /** Atualiza o cookie de Access Token com um novo valor. */
  updateAccessToken(response: Response, token: string): void;

  /** Remove o cookie de Access Token da resposta HTTP. */
  clearAccessToken(response: Response): void;
}
