import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';
import AppError from '@shared/errors/AppError';

@injectable()
class DeleteProjectService {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectRepository
  ) {}

  public async execute(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found.', 'DeleteProjectService', 404);
    }

    await this.projectRepository.remove(project);
  }
}

export default DeleteProjectService;
