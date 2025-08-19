import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ICreateTask } from '../domain/models/ICreateTask';
import { ITask } from '../domain/models/ITask';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';

@injectable()
class CreateTaskService {
    constructor(
        @inject('TasksRepository')
        private tasksRepository: ITaskRepository,
        @inject('CryptoProvider')
        private cryptoProvider: ICryptographyProvider,
        @inject('UsersRepository')
        private usersRepository: IUserRepository
    ) { }

    public async execute({ title, description, variablesEnvironment, userId }: ICreateTask): Promise<ITask> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(`User not exist: ${userId}`, 400);
        }

        const taskExistent = await this.tasksRepository.findByName(title, user);
        if (taskExistent) {
            throw new AppError('Title of the task in use', 400);
        }

        // 🔹 Criptografa o valor
        const encrypted = await this.cryptoProvider.encrypt(variablesEnvironment);

        // 🔹 Cria a task salvando o valor criptografado e o IV
        const taskCreated = await this.tasksRepository.create({
            title,
            description,
            variablesEnvironment: encrypted.content,
            InitializationVector: encrypted.iv,
            userId
        });

        // 🔹 Devolve o valor original para o usuário
        return { ...taskCreated, variablesEnvironment };
    }
}

export default CreateTaskService;
