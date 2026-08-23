import { IUser } from '@modules/users/domain/models/IUser';
import { ITag } from '@modules/tags/domain/models/ITag';

export interface IProject {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  initializationVector: string;
  repository: string;
  user: IUser;
  tag?: ITag;
  userId?: string;
  tagId?: string;
  createdAt: Date;
  updatedAt: Date;
}
