export interface IRequestCreateSession {
  email: string;
  password: string;
}
interface IUserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: Date;
  updated_at: Date;
}
export interface IResponseCreateSession {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}
