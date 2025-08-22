import { ICreateProject } from '../models/ICreateProject';
import { IProject } from '../models/IProject';
import { IUser } from '@modules/users/domain/models/IUser';

export interface IProjectRepository {
  findByName(name: string, user: IUser): Promise<IProject | undefined>;
  findById(id: string): Promise<IProject | undefined>;
  list(userId: string): Promise<IProject[] | undefined>;
  create(data: ICreateProject): Promise<IProject>;
  update(project: IProject): Promise<IProject | undefined>;
  save(project: IProject): Promise<IProject>;
  remove(project: IProject): Promise<void>;
}
