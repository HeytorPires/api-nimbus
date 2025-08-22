import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import { IUpdateProject } from '../domain/models/IUpdateProject';
import { IProjectDTO } from '../dtos/IProjectDTO';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';

@injectable()
class UpdateProjectService {
  private projectMapper: ProjectMapper;

  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('TagsRepository')
    private tagsRepository: ITagRepository
  ) {
    this.projectMapper = new ProjectMapper();
  }

  public async execute({
    id,
    title,
    description,
    variablesEnvironment,
    userId,
    tagId
  }: IUpdateProject): Promise<IProjectDTO> {
    const project = await this.projectsRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found.');
    }

    const user = await this.usersRepository.findById(userId);
    if (project.user.id !== user?.id) {
      throw new AppError('Access denied.');
    }

    if (tagId) {
      const tag = await this.tagsRepository.findById(tagId);
      if (!tag) {
        throw new AppError(`Tag not found: ${tagId}`, 400);
      }
      if (tag.user.id !== userId) {
        throw new AppError('Tag belongs to another user', 403);
      }
      project.tag = tag;
    }

    project.title = title;
    project.description = description;

    const encrypted = await this.cryptoProvider.encrypt(variablesEnvironment);
    project.variablesEnvironment = encrypted.content;
    project.InitializationVector = encrypted.iv;

    await this.projectsRepository.save(project);

    const projectDTO = this.projectMapper.toDTO(project);
    projectDTO.variablesEnvironment = variablesEnvironment;

    return projectDTO;
  }
}

export default UpdateProjectService;
