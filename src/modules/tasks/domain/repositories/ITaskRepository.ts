import { ICreateTask } from '../models/ICreateTask';
import { ITask } from '../models/ITask';
import { IUpdateTask } from '../models/IUpdateTask';
import User from '@modules/users/infra/typeorm/entities/User';

export interface ITaskRepository {
  findByName(title: string, user: User): Promise<ITask | undefined>;
  findById(id: string): Promise<ITask | undefined>;
  list(userId: string): Promise<ITask[] | undefined>;
  create({ title, description, variablesEnvironment, InitializationVector }: ICreateTask): Promise<ITask>;
  update(task: ITask): Promise<ITask | undefined>;
  save(task: ITask): Promise<ITask>;
  remove(task: ITask): Promise<void>;
}
