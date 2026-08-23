import { UserDTO } from '@modules/users/domain/dtos/UserDTO';

export interface IRequestCreateSession {
  email: string;
  password: string;
}
export interface IResponseCreateSession {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}
