import AppError from '@shared/errors/AppError';
import { ITask } from '../domain/models/ITask';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { TaskMapper } from '../mapper/TaskMapper';
import { ITaskDTO } from '../dtos/ITaskDTO';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { decrypt } from 'dotenv';

@injectable()
class ShowTaskService {
  private taskMapper: TaskMapper

  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITaskRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
    @inject('UsersRepository')
    private usersRepository: IUserRepository
  ) {
    this.taskMapper = new TaskMapper()
  }

  public async execute(id: string, userId: string): Promise<ITaskDTO> {

    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found.');
    }

    const user = await this.usersRepository.findById(userId)

    if (task.user.id !== user?.id) {
      throw new AppError('task not found.');
    }

    const taskDTO = this.taskMapper.toDTO(task)

    const decrypted = await this.cryptoProvider.decrypt({
      iv: task.InitializationVector,
      content: task.variablesEnvironment
    });
    taskDTO.variablesEnvironment = decrypted;

    return taskDTO;
  }
}

export default ShowTaskService;
