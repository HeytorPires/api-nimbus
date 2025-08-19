import AppError from '@shared/errors/AppError';
import { ITask } from '../domain/models/ITask';
import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';

@injectable()
class ShowTaskService {
    constructor(
        @inject('TasksRepository')
        private tasksRepository: ITaskRepository,
        @inject('CryptoProvider')
        private cryptoProvider: ICryptographyProvider,
    ) { }

    public async execute(id: string): Promise<ITask> {
        const task = await this.tasksRepository.findById(id);

        if (!task) {
            throw new AppError('Task not found.');
        }

        // 🔹 Descriptografando corretamente
        if (task.InitializationVector && task.variablesEnvironment) {
            const decrypted = await this.cryptoProvider.decrypt({
                iv: task.InitializationVector,
                content: task.variablesEnvironment
            });

            task.variablesEnvironment = decrypted;
        }

        return task;
    }
}

export default ShowTaskService;
