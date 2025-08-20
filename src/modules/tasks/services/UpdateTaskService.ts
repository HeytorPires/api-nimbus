import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { IUpdateTask } from '../domain/models/IUpdateTask';
import { ITaskDTO } from '../dtos/ITaskDTO';
import { TaskMapper } from '../mapper/TaskMapper';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';

@injectable()
class UpdateTaskService {
  private taskMapper: TaskMapper;

  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITaskRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('TagsRepository')
    private tagsRepository: ITagRepository
  ) {
    this.taskMapper = new TaskMapper()
  }

  public async execute({
    id,
    title,
    description,
    variablesEnvironment,
    userId,
    tagId
  }: IUpdateTask): Promise<ITaskDTO> {
    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new AppError('task not found.');
    }
    const user = await this.usersRepository.findById(userId)

    if (task.user.id !== user?.id) {
      throw new AppError('task not found.');
    }

    if (tagId) {
      const tag = await this.tagsRepository.findById(tagId);
      if (!tag) {
        throw new AppError(`Tag not found: ${tagId}`, 400);
      }
      if (tag.user.id !== userId) {
        throw new AppError('Tag belongs to another user', 403);
      }
      task.tag = tag;
    }

    task.title = title
    task.description = description;

    const encrypted = await this.cryptoProvider.encrypt(variablesEnvironment)

    task.variablesEnvironment = encrypted.content;
    task.InitializationVector = encrypted.iv

    await this.tasksRepository.update(task);

    const taskDTO = this.taskMapper.toDTO(task)
    taskDTO.variablesEnvironment = variablesEnvironment

    return taskDTO;
  }
}

export default UpdateTaskService;
