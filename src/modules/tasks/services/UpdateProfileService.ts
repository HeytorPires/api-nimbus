import AppError from '@shared/errors/AppError';
import { ITask } from '../domain/models/ITask';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { IUpdateTask } from '../domain/models/IUpdateTask';

@injectable()
class UpdateProfileService {
    constructor(
        @inject('TasksRepository')
        private tasksRepository: ITaskRepository
    ) { }
    public async execute({
        id,
        title,
        description,
        variablesEnvironment,
    }: IUpdateTask): Promise<ITask> {
        const task = await this.tasksRepository.findById(id);

        if (!task) {
            throw new AppError('task not found.');
        }
        task.title = title
        task.description = description;
        task.variablesEnvironment = variablesEnvironment;

        await this.tasksRepository.update(task);

        return task;
    }
}

export default UpdateProfileService;
