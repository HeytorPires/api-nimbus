import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ICreateTask } from '../domain/models/ICreateTask';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { TaskMapper } from '../mapper/TaskMapper';
import { ITaskDTO } from '../dtos/ITaskDTO';

@injectable()
class CreateTaskService {
  private taskMapper: TaskMapper
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
    title,
    description,
    variablesEnvironment,
    userId,
    tagId
  }: ICreateTask): Promise<ITaskDTO> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(`User not exist: ${userId}`, 400);
    }

    if (tagId) {
      const tag = await this.tagsRepository.findById(tagId);
      if (!tag) {
        throw new AppError(`Tag not found: ${tagId}`, 400);
      }
      if (tag.user.id !== userId) {
        throw new AppError('Tag belongs to another user', 403);
      }
    }

    const taskExistent = await this.tasksRepository.findByName(title, user);
    if (taskExistent) {
      throw new AppError('Title of the task in use', 400);
    }

    const encrypted = await this.cryptoProvider.encrypt(variablesEnvironment);

    const taskCreated = await this.tasksRepository.create({
      title,
      description,
      variablesEnvironment: encrypted.content,
      InitializationVector: encrypted.iv,
      userId,
      tagId,
    });

    const taskDTO = this.taskMapper.toDTO(taskCreated);
    taskDTO.variablesEnvironment = variablesEnvironment;

    return taskDTO;
  }

}

export default CreateTaskService;
