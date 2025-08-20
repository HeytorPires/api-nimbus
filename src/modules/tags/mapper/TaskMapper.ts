import { ITaskDTO } from '../dtos/ITaskDTO';
import { ITask } from '../domain/models/ITag';

export class TaskMapper {
  toDTO(task: ITask): ITaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      variablesEnvironment: task.variablesEnvironment,
      repository: task.repository,
      updated_at: task.updated_at,
      userId: task.user.id,
    };
  }

  toDTOList(tasks: ITask[]): ITaskDTO[] {
    return tasks.map(task => this.toDTO(task));
  }
}
