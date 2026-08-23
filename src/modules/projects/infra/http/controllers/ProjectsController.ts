import { Request, Response } from 'express';
import ListProjectService from '@modules/projects/services/ListProjectService';
import ShowProjectService from '@modules/projects/services/ShowProjectService';
import { container } from 'tsyringe';
import CreateProjectService from '@modules/projects/services/CreateProjectService';
import DeleteProjectService from '@modules/projects/services/DeleteProjectService';
import UpdateProjectService from '@modules/projects/services/UpdateProjectService';

export default class ProjectsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { title, description, variablesEnvironment, tagId } = request.body;
    const userId = request.user.id;
    const createProjects = container.resolve(CreateProjectService);
    const project = await createProjects.execute({
      title,
      description,
      variablesEnvironment,
      userId,
      tagId,
    });

    return response.json(project);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listProjects = container.resolve(ListProjectService);
    const userId = request.user.id;
    const { perPage, currentPage } = request.query as {
      perPage: string;
      currentPage: string;
    };
    const projects = await listProjects.execute(
      Number(perPage) || 10,
      Number(currentPage) || 1,
      userId
    );

    return response.status(200).json(projects);
  }

  public async findById(
    request: Request,
    response: Response
  ): Promise<Response> {
    const findProject = container.resolve(ShowProjectService);
    const { id } = request.params;
    const userId = request.user.id;
    const project = await findProject.execute(id, userId);

    return response.json(project);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const deleteProject = container.resolve(DeleteProjectService);
    const { id } = request.params;
    const userId = request.user.id;
    await deleteProject.execute(id, userId);

    return response.status(204).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateProject = container.resolve(UpdateProjectService);
    const { id } = request.params;
    const { title, description, variablesEnvironment, tagId } = request.body;
    const userId = request.user.id;
    const project = await updateProject.execute({
      id,
      title,
      description,
      variablesEnvironment,
      userId,
      tagId,
    });

    return response.status(200).json(project);
  }
}
