import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ProjectMapper } from '../mapper/ProjectMapper';
import { IProjectDTO } from '../dtos/IProjectDTO';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';

@injectable()
class ListProjectService {
  private projectMapper: ProjectMapper;

  constructor(
    @inject('ProjectsRepository')
    private projectRepository: IProjectRepository,
    @inject('CryptoProvider')
    private cryptoProvider: ICryptographyProvider
  ) {
    this.projectMapper = new ProjectMapper();
  }

  public async execute(
    perPage: number,
    currentPage: number,
    userId: string
  ): Promise<IPaginationReturn<IProjectDTO[]>> {
    const projects = await this.projectRepository.list(
      perPage,
      currentPage,
      userId
    );

    const projectsDTO = this.projectMapper.toDTOList(projects.data);

    for (const project of projectsDTO) {
      if (project.variablesEnvironment && project.InitializationVector) {
        project.variablesEnvironment = await this.cryptoProvider.decrypt({
          content: project.variablesEnvironment,
          iv: project.InitializationVector,
        });
      }
    }

    return {
      ...projects,
      data: projectsDTO,
    };
  }
}

export default ListProjectService;

