import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import AppError from '@shared/errors/AppError';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { IProjectDTO } from '../dtos/IProjectDTO';

@injectable()
class ShowProjectService {
  private readonly projectMapper: ProjectMapper;

  constructor(
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectRepository,
    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptographyProvider
  ) {
    this.projectMapper = new ProjectMapper();
  }

  public async execute(id: string, user_id: string): Promise<IProjectDTO> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found.', 404);
    }

    if (project.user.id !== user_id) {
      throw new AppError('Access denied.', 403);
    }

    const projectDTO = this.projectMapper.toDTO(project);
    projectDTO.variablesEnvironment = await this.cryptoProvider.decrypt({
      content: project.variablesEnvironment,
      iv: project.InitializationVector,
    });

    return projectDTO;
  }
}

export default ShowProjectService;
