import { v4 as uuidv4 } from 'uuid';
import { IProjectRepository } from '@modules/projects/domain/repositories/IProjectRepository';
import { ICreateProject } from '@modules/projects/domain/models/ICreateProject';
import { IProject } from '@modules/projects/domain/models/IProject';
import { IUser } from '@modules/users/domain/models/IUser';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';
import Project from '@modules/projects/infra/typeorm/entities/Project';
import User from '@modules/users/infra/typeorm/entities/User';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';

class FakeProjectsRepository implements IProjectRepository {
  private projects: Project[] = [];

  public async create({
    title,
    description,
    variablesEnvironment,
    InitializationVector,
    user_id,
    tag_id,
  }: ICreateProject): Promise<Project> {
    const project = new Project();

    project.id = uuidv4();
    project.title = title;
    project.description = description;
    project.variablesEnvironment = variablesEnvironment;
    project.InitializationVector = InitializationVector || '';
    project.user_id = user_id;
    project.repository = '';
    project.updated_at = new Date();
    project.created_at = new Date();

    const user = new User();
    user.id = user_id;
    project.user = user;

    if (tag_id) {
      project.tag_id = tag_id;
      const tag = new Tag();
      tag.id = tag_id;
      project.tag = tag;
    }

    this.projects.push(project);

    return project;
  }

  public async save(project: Project): Promise<Project> {
    const findIndex = this.projects.findIndex((p) => p.id === project.id);
    if (findIndex >= 0) {
      this.projects[findIndex] = project;
    }
    return project;
  }

  public async update(project: IProject): Promise<IProject | undefined> {
    const findIndex = this.projects.findIndex((p) => p.id === project.id);
    if (findIndex === -1) return undefined;
    this.projects[findIndex] = project as Project;
    return project;
  }

  public async remove(project: IProject): Promise<void> {
    const findIndex = this.projects.findIndex((p) => p.id === project.id);
    if (findIndex >= 0) {
      this.projects.splice(findIndex, 1);
    }
  }

  public async findByName(
    name: string,
    user: IUser
  ): Promise<IProject | undefined> {
    return this.projects.find((p) => p.title === name && p.user.id === user.id);
  }

  public async findById(id: string): Promise<IProject | undefined> {
    return this.projects.find((p) => p.id === id);
  }

  public async list(
    perPage: number,
    currentPage: number,
    user_id: string
  ): Promise<IPaginationReturn<IProject[]>> {
    const filtered = this.projects.filter((p) => p.user.id === user_id);
    const start = (currentPage - 1) * perPage;
    const data = filtered.slice(start, start + perPage);
    return {
      perPage,
      currentPage,
      totalRows: filtered.length,
      data,
    };
  }
}

export default FakeProjectsRepository;
