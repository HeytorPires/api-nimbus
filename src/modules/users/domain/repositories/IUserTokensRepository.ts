import { IUserToken } from '../models/IUserToken';

export interface ICreateUserToken {
  token: string;
  user_id: string;
}

export interface IUserTokensRepository {
  findByToken(token: string): Promise<IUserToken | undefined>;
  findByUserId(user_id: string): Promise<IUserToken | undefined>;
  deleteByToken(token: string): Promise<void>;
  generate(user_id: string): Promise<IUserToken>;
  save(data: ICreateUserToken): Promise<IUserToken>;
  removeByUserId(user_id: string): Promise<void>;
}
