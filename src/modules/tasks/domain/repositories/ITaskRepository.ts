import { IUser } from '@modules/users/domain/models/IUser';
import { ICreateTask } from '../models/ICreateTask';
import { ITask } from '../models/ITask';
import { IUpdateTask } from '../models/IUpdateTask';

export interface ITaskRepository {
    findByName(title: string, user: IUser): Promise<ITask | undefined>;
    findById(id: string): Promise<ITask | undefined>;
    list(userId: string): Promise<ITask[] | undefined>;
    create({ title, description, variablesEnvironment, InitializationVector, userId }: ICreateTask): Promise<ITask>;
    update({ id, title, description, variablesEnvironment, }: IUpdateTask): Promise<ITask | undefined>;
    save(task: ITask): Promise<ITask>;
    remove(task: ITask): Promise<void>;
}
