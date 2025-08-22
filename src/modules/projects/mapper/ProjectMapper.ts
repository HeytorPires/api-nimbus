import { IProjectDTO } from '../dtos/IProjectDTO';
import { IProject } from '../domain/models/IProject';

export class ProjectMapper {
  toDTO(project: IProject): IProjectDTO {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      variablesEnvironment: project.variablesEnvironment,
      InitializationVector: project.InitializationVector,
      repository: project.repository,
      updated_at: project.updated_at,
      userId: project.user.id,
      tagId: project.tag?.id,
    };
  }

  toDTOList(projects: IProject[]): IProjectDTO[] {
    return projects.map(project => this.toDTO(project));
  }
}
