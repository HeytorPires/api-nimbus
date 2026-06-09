import { IProjectDTO } from '../dtos/IProjectDTO';
import { IProject } from '../domain/models/IProject';

export class ProjectMapper {
  toDTO(project: IProject): IProjectDTO {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      variablesEnvironment: project.variablesEnvironment,
      created_at: project.created_at,
      updated_at: project.updated_at,
      user_id: project.user_id ?? project.user?.id,
      tag_id: project.tag_id ?? project.tag?.id,
    };
  }

  toDTOList(projects: IProject[]): IProjectDTO[] {
    return projects.map((project) => this.toDTO(project));
  }
}
