import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { ITask } from '../domain/models/ITask';

@injectable()
class ListTaskService {
    constructor(
        @inject('TasksRepository')
        private taskRepository: ITaskRepository
    ) { }
    public async execute(userid: string): Promise<ITask[] | undefined> {
        console.log("User id: ", userid)
        const tasks = await this.taskRepository.list(userid);

        return tasks;
    }
}

export default ListTaskService;
