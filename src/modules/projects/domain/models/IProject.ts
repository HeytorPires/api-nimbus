import { IUser } from '@modules/users/domain/models/IUser';
import { ITag } from '@modules/tags/domain/models/ITag';

export interface IProject {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  InitializationVector: string;
  repository: string;
  user: IUser;
  tag?: ITag;
  userid?: string;
  tagId?: string;
  updated_at: Date;
}

