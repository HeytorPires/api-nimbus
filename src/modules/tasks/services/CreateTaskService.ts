import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { IHashProvider } from '@shared/providers/HashProvider/models/IHashProvider';
import { ICreateTask } from '../domain/models/ICreateTask';
import { ITask } from '../domain/models/ITask';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';

@injectable()
class CreateTaskService {
    constructor(
        @inject('TasksRepository')
        private tasksRepository: ITaskRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('UsersRepository')
        private usersRepository: IUserRepository
    ) { }
    public async execute({ title, description, variablesEnvironment, userId }: ICreateTask): Promise<ITask> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new AppError('User not exist', 400);
        }
        const taskExistent = await this.tasksRepository.findByName(title, user);

        if (taskExistent) {
            throw new AppError('Title of the task in use', 400);
        }

        const hashedVariables = await this.hashProvider.generateHash(variablesEnvironment);

        const taskCreated = await this.tasksRepository.create({ title, description, variablesEnvironment: hashedVariables, userId })

        return taskCreated
    }
}

export default CreateTaskService;
