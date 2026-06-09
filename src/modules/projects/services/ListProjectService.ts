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
    user_id: string
  ): Promise<IPaginationReturn<IProjectDTO[]>> {
    const projects = await this.projectRepository.list(
      perPage,
      currentPage,
      user_id
    );

    const projectsDTO = this.projectMapper.toDTOList(projects.data);

    for (let i = 0; i < projects.data.length; i++) {
      const entity = projects.data[i];
      if (entity.variablesEnvironment && entity.InitializationVector) {
        projectsDTO[i].variablesEnvironment = await this.cryptoProvider.decrypt(
          {
            content: entity.variablesEnvironment,
            iv: entity.InitializationVector,
          }
        );
      }
    }

    return {
      ...projects,
      data: projectsDTO,
    };
  }
}

export default ListProjectService;
