import { getRepository, Repository } from 'typeorm';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { ICreateTask } from '../../../domain/models/ICreateTask';
import { ITask } from '@modules/tasks/domain/models/ITask';
import { IUser } from '@modules/users/domain/models/IUser';
import Task from '../entities/Task';
import { IUpdateTask } from '@modules/tasks/domain/models/IUpdateTask';

export default class TasksRepository implements ITaskRepository {
    private ormRepository: Repository<Task>;
    constructor() {
        this.ormRepository = getRepository(Task);
    }

    public async create({ title, description, variablesEnvironment, userId }: ICreateTask): Promise<Task> {
        const entity = this.ormRepository.create({
            title,
            description,
            variablesEnvironment,
            user: { id: userId },
        });
        await this.ormRepository.save(entity);
        return entity;
    }


    public async save(task: Task): Promise<Task> {
        await this.ormRepository.save(task);
        return task;
    }

    public async remove(task: Task): Promise<void> {
        await this.ormRepository.remove(task);
    }

    public async list(user: IUser): Promise<ITask[] | undefined> {
        const tasks = await this.ormRepository.find({
            where: user
        });
        return tasks;
    }
    public async findByName(name: string, user: IUser): Promise<ITask | undefined> {
        const entity = await this.ormRepository.findOne({ where: { name, user } });
        return entity;
    }

    public async findById(id: string): Promise<ITask | undefined> {
        const user = await this.ormRepository.findOne({ where: { id } });
        return user;
    }
    public async update({
        id,
        title,
        description,
        variablesEnvironment,
    }: IUpdateTask): Promise<ITask | undefined> {
        await this.ormRepository
            .createQueryBuilder()
            .update(Task)
            .set({ title, description, variablesEnvironment })
            .where("id = :id", { id })
            .execute();

        return await this.ormRepository.findOne({ where: { id } });
    }
}

