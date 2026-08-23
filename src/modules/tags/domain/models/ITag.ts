import { IUser } from '@modules/users/domain/models/IUser';

export interface ITag {
  id: string;
  name: string;
  userId: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
