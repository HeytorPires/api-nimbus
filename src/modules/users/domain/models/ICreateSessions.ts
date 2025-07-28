import { IUser } from './IUser';

export interface IRequestCreateSession {
  email: string;
  password: string;
}

export interface IResponseCreateSession {
  user: IUser;
  token: string;
}
