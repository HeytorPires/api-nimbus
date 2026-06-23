import { UserDTO } from '../dtos/UserDTO';

export interface IRequestCreateSession {
  email: string;
  password: string;
}

export interface IResponseCreateSession {
  user: UserDTO;
  token: string;
}
