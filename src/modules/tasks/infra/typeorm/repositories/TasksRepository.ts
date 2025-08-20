import { getRepository, Repository } from 'typeorm';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { ICreateTask } from '../../../domain/models/ICreateTask';
import { ITask } from '@modules/tasks/domain/models/ITask';
import { IUser } from '@modules/users/domain/models/IUser';
import Task from '../entities/Task';

export default class TasksRepository implements ITaskRepository {
  private ormRepository: Repository<Task>;
  constructor() {
    this.ormRepository = getRepository(Task);
  }

  public async create({ title, description, variablesEnvironment, InitializationVector, userId }: ICreateTask): Promise<ITask> {
    const entity = this.ormRepository.create({
      title, description, variablesEnvironment, InitializationVector,
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

  public async list(userId: string): Promise<ITask[] | undefined> {
    const tasks = await this.ormRepository.find({
      where:
        { user: { id: userId } },
      relations: ['user']
    });
    return tasks;
  }
  public async findByName(title: string, user: IUser): Promise<ITask | undefined> {
    const entity = await this.ormRepository.findOne({ where: { title, user } });
    return entity;
  }

  public async findById(id: string): Promise<ITask | undefined> {
    console.log(id)
    const task = await this.ormRepository.findOne({ where: { id }, relations: ['user'] });
    return task;
  }
  public async update(task: ITask): Promise<ITask | undefined> {
    await this.ormRepository
      .createQueryBuilder()
      .update(Task)
      .set(task)
      .where("id = :id", { id: task.id })
      .execute();

    return await this.ormRepository.findOne({ where: { id: task.id } });
  }
}

