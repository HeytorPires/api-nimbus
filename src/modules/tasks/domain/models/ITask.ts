import { IUser } from "@modules/users/domain/models/IUser";
import { ITag } from "@modules/tags/domain/models/ITag";

export interface ITask {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  InitializationVector: string;
  repository: string;
  user: IUser;
  tag?: ITag;
  updated_at: Date;
}
