import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ITask } from '../domain/models/ITask';
import { IUser } from '@modules/users/domain/models/IUser';

@injectable()
class ListTaskService {
    constructor(
        @inject('TasksRepository')
        private taskRepository: ITaskRepository
    ) { }
    public async execute(user: IUser): Promise<ITask[] | undefined> {
        const tasks = await this.taskRepository.list(user);

        return tasks;
    }
}

export default ListTaskService;
