import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ITask } from '../domain/models/ITask';
import { TaskMapper } from '../mapper/TaskMapper';
import { throws } from 'assert';
import { ITaskDTO } from '../dtos/ITaskDTO';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';

@injectable()
class ListTaskService {
  private taskMapper: TaskMapper;

  constructor(
    @inject('TasksRepository')
    private taskRepository: ITaskRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
  ) {
    this.taskMapper = new TaskMapper()
  }
  public async execute(userid: string): Promise<ITaskDTO[] | undefined> {
    const tasks = await this.taskRepository.list(userid);

    if (!tasks) return undefined;

    await Promise.all(
      tasks.map(async (task) => {
        if (task.variablesEnvironment && task.InitializationVector) {
          task.variablesEnvironment = await this.cryptoProvider.decrypt({
            iv: task.InitializationVector,
            content: task.variablesEnvironment,
          });
        }
      })
    );

    const tasksDTO = this.taskMapper.toDTOList(tasks!)
    return tasksDTO;
  }
}

export default ListTaskService;
