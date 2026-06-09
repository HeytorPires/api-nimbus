import { IUser } from '@modules/users/domain/models/IUser';

export interface ITag {
  id: string;
  name: string;
  user_id: string;
  user: IUser;
  created_at: Date;
}

