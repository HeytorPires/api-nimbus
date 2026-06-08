import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import { ICreateProject } from '../domain/models/ICreateProject';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { IProjectDTO } from '../dtos/IProjectDTO';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';

@injectable()
class CreateProjectService {
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
    title,
    description,
    variablesEnvironment,
    user_id,
    tag_id,
  }: ICreateProject): Promise<IProjectDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(`User not exist: ${user_id}`, 400);
    }

    if (tag_id) {
      const tag = await this.tagsRepository.findById(tag_id);
      if (!tag) {
        throw new AppError(`Tag not found: ${tag_id}`, 400);
      }
      if (tag.user.id !== user_id) {
        throw new AppError('Tag belongs to another user', 403);
      }
    }

    const projectExistent = await this.projectsRepository.findByName(
      title,
      user
    );
    if (projectExistent) {
      throw new AppError('Project title already in use', 400);
    }

    const encrypted = await this.cryptoProvider.encrypt(variablesEnvironment);

    const projectCreated = await this.projectsRepository.create({
      title,
      description,
      variablesEnvironment: encrypted.content,
      InitializationVector: encrypted.iv,
      user_id,
      tag_id,
    });

    const projectDTO = this.projectMapper.toDTO(projectCreated);
    projectDTO.variablesEnvironment = variablesEnvironment;

    return projectDTO;
  }
}

export default CreateProjectService;
