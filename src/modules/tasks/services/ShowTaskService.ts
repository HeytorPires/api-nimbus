import AppError from '@shared/errors/AppError';
import { ITask } from '../domain/models/ITask';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';

@injectable()
class ShowTaskService {
    constructor(
        @inject('TasksRepository')
        private tasksRepository: ITaskRepository
    ) { }
    public async execute(id: string): Promise<ITask | undefined> {
        const task = await this.tasksRepository.findById(id);

        if (!task) {
            throw new AppError('Task not found.');
        }

        return task;
    }
}

export default ShowTaskService;
