import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { IProjectDTO } from '../dtos/IProjectDTO';

@injectable()
class ListProjectService {
  private projectMapper: ProjectMapper;

  constructor(
    @inject('ProjectsRepository')
    private projectRepository: IProjectRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider,
  ) {
    this.projectMapper = new ProjectMapper();
  }

  public async execute(userId: string): Promise<IProjectDTO[] | undefined> {
    const projects = await this.projectRepository.list(userId);

    if (!projects) return undefined;

    const projectsDTO = this.projectMapper.toDTOList(projects);

    for (const project of projectsDTO) {
      if (project.variablesEnvironment && project.InitializationVector) {
        project.variablesEnvironment = await this.cryptoProvider.decrypt({
          content: project.variablesEnvironment,
          iv: project.InitializationVector
        });
      }
    }

    return projectsDTO;
  }
}

export default ListProjectService;
