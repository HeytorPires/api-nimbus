import { getRepository, Repository } from 'typeorm';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ICreateProject } from '../../../domain/models/ICreateProject';
import { IProject } from '@modules/projects/domain/models/IProject';
import { IUser } from '@modules/users/domain/models/IUser';
import Project from '../entities/Project';

export default class ProjectsRepository implements IProjectRepository {
  private ormRepository: Repository<Project>;

  constructor() {
    this.ormRepository = getRepository(Project);
  }

  public async create({ title, description, variablesEnvironment, InitializationVector, userId, tagId }: ICreateProject): Promise<IProject> {
    const project = this.ormRepository.create({
      title,
      description,
      variablesEnvironment,
      InitializationVector,
      user: { id: userId },
      tag: tagId ? { id: tagId } : undefined,
    });

    await this.ormRepository.save(project);

    return project;
  }

  public async save(project: Project): Promise<Project> {
    await this.ormRepository.save(project);
    return project;
  }

  public async remove(project: Project): Promise<void> {
    await this.ormRepository.remove(project);
  }

  public async list(userId: string): Promise<IProject[] | undefined> {
    const projects = await this.ormRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'tag']
    });
    return projects;
  }

  public async findByName(title: string, user: IUser): Promise<IProject | undefined> {
    const project = await this.ormRepository.findOne({
      where: { title, user }
    });
    return project;
  }

  public async findById(id: string): Promise<IProject | undefined> {
    const project = await this.ormRepository.findOne({
      where: { id },
      relations: ['user', 'tag']
    });
    return project;
  }

  public async update(project: IProject): Promise<IProject | undefined> {
    await this.ormRepository
      .createQueryBuilder()
      .update(Project)
      .set(project)
      .where("id = :id", { id: project.id })
      .execute();

    return await this.ormRepository.findOne({ where: { id: project.id } });
  }
}
