import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';
import { ICreateProject } from '../models/ICreateProject';
import { IProject } from '../models/IProject';
import { IUser } from '@modules/users/domain/models/IUser';

export interface IProjectRepository {
  findByName(name: string, user: IUser): Promise<IProject | undefined>;
  findById(id: string): Promise<IProject | undefined>;
  list(
    perPage: number,
    currentPage: number,
    userId: string
  ): Promise<IPaginationReturn<IProject[]>>;
  create(data: ICreateProject): Promise<IProject>;
  update(project: IProject): Promise<IProject | undefined>;
  save(project: IProject): Promise<IProject>;
  remove(project: IProject): Promise<void>;
}

