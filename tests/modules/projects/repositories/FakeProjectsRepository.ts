import { v4 as uuidv4 } from 'uuid';
import { IProjectRepository } from '@modules/projects/domain/repositories/IProjectRepository';
import { ICreateProject } from '@modules/projects/domain/models/ICreateProject';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';
import { IUser } from '@modules/users/domain/models/IUser';
import Project from '@modules/projects/infra/typeorm/entities/Project';
import User from '@modules/users/infra/typeorm/entities/User';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';

class FakeProjectsRepository implements IProjectRepository {
  private projects: Project[] = [];

  private buildUser(userId: string): User {
    const user = new User();
    user.id = userId;

    return user;
  }

  private buildTag(tagId: string, userId: string): Tag {
    const tag = new Tag();
    tag.id = tagId;
    tag.userId = userId;
    tag.user = this.buildUser(userId);

    return tag;
  }

  public async findByName(
    name: string,
    user: IUser
  ): Promise<Project | undefined> {
    return this.projects.find(
      (project) => project.title === name && project.user.id === user.id
    );
  }

  public async findById(id: string): Promise<Project | undefined> {
    return this.projects.find((project) => project.id === id);
  }

  public async list(
    perPage: number,
    currentPage: number,
    userId: string
  ): Promise<IPaginationReturn<Project[]>> {
    const userProjects = this.projects.filter(
      (project) => project.user.id === userId
    );
    const pageSize = perPage > 0 ? perPage : userProjects.length || 1;
    const page = currentPage > 0 ? currentPage : 1;
    const startIndex = (page - 1) * pageSize;

    return {
      perPage: pageSize,
      currentPage: page,
      totalRows: userProjects.length,
      data: userProjects.slice(startIndex, startIndex + pageSize),
    };
  }

  public async create({
    title,
    description,
    variablesEnvironment,
    InitializationVector,
    userId,
    tagId,
  }: ICreateProject): Promise<Project> {
    const project = new Project();

    project.id = uuidv4();
    project.title = title;
    project.description = description;
    project.variablesEnvironment = variablesEnvironment;
    project.InitializationVector = InitializationVector || '';
    project.repository = '';
    project.userId = userId;
    project.user = this.buildUser(userId);
    project.updated_at = new Date();

    if (tagId) {
      project.tagId = tagId;
      project.tag = this.buildTag(tagId, userId);
    }

    this.projects.push(project);

    return project;
  }

  public async update(project: Project): Promise<Project | undefined> {
    const projectIndex = this.projects.findIndex(
      (storedProject) => storedProject.id === project.id
    );

    if (projectIndex === -1) {
      return undefined;
    }

    this.projects[projectIndex] = project;

    return project;
  }

  public async save(project: Project): Promise<Project> {
    const projectIndex = this.projects.findIndex(
      (storedProject) => storedProject.id === project.id
    );

    this.projects[projectIndex] = project;

    return project;
  }

  public async remove(project: Project): Promise<void> {
    this.projects = this.projects.filter(
      (storedProject) => storedProject.id !== project.id
    );
  }
}

export default FakeProjectsRepository;
