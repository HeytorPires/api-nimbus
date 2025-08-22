import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import AppError from '@shared/errors/AppError';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { IProjectDTO } from '../dtos/IProjectDTO';

@injectable()
class ShowProjectService {
  private projectMapper: ProjectMapper;

  constructor(
    @inject('ProjectsRepository')
    private projectRepository: IProjectRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
  ) {
    this.projectMapper = new ProjectMapper();
  }

  public async execute(id: string, userId: string): Promise<IProjectDTO> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found.', 404);
    }

    if (project.user.id !== userId) {
      throw new AppError('Access denied.', 403);
    }

    const projectDTO = this.projectMapper.toDTO(project);
    projectDTO.variablesEnvironment = await this.cryptoProvider.decrypt(
      project.variablesEnvironment,
    );

    return projectDTO;
  }
}

export default ShowProjectService;
