import { IUserToken } from '../models/IUserToken';

export interface ICreateUserToken {
  token: string;
  userId: string;
}

export interface IUserTokensRepository {
  findByToken(token: string): Promise<IUserToken | undefined>;
  findByUserId(userId: string): Promise<IUserToken | undefined>;
  deleteByToken(token: string): Promise<void>;
  generate(userId: string): Promise<IUserToken>;
  save(data: ICreateUserToken): Promise<IUserToken>;
  removeByUserId(userId: string): Promise<void>;
}
