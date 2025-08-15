import { IUser } from '@modules/users/domain/models/IUser';
import { ICreateTask } from '../models/ICreateTask';
import { ITask } from '../models/ITask';
import { IUpdateTask } from '../models/IUpdateTask';

export interface ITaskRepository {
    findByName(name: string, user: IUser): Promise<ITask | undefined>;
    findById(id: string): Promise<ITask | undefined>;
    list(user: IUser): Promise<ITask[] | undefined>;
    create({ title, description, variablesEnvironment, userId }: ICreateTask): Promise<ITask>;
    update({ id, title, description, variablesEnvironment, }: IUpdateTask): Promise<ITask | undefined>;
    save(task: ITask): Promise<ITask>;
    remove(task: ITask): Promise<void>;
}
