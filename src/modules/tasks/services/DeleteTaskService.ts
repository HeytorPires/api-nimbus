import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';

@injectable()
class DeleteTaskService {
  constructor(
    @inject('TasksRepository')
    private taskRepository: ITaskRepository
  ) { }
  public async execute(id: string) {
    const task = await this.taskRepository.findById(id);
    console.log(id, task)
    if (!task) {
      throw new AppError('Task not found!');
    }

    await this.taskRepository.remove(task)
  }
}

export default DeleteTaskService;
