import { Request, Response } from 'express';
import ListProjectService from '@modules/projects/services/ListProjectService';
import ShowProjectService from '@modules/projects/services/ShowProjectService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import CreateProjectService from '@modules/projects/services/CreateProjectService';
import DeleteProjectService from '@modules/projects/services/DeleteProjectService';
import UpdateProjectService from '@modules/projects/services/UpdateProjectService';

export default class ProjectsController {
  public async create(request: Request, response: Response) {
    const { title, description, variablesEnvironment, tagId } = request.body;
    const userId = request.user.id;
    const createProjects = container.resolve(CreateProjectService);
    const project = await createProjects.execute({
      title,
      description,
      variablesEnvironment,
      userId,
      tagId
    });

    response.json(instanceToInstance(project));
    return;
  }

  public async list(request: Request, response: Response) {
    const listProjects = container.resolve(ListProjectService);
    const userId = request.user.id;
    const projects = await listProjects.execute(userId);

    response.json(instanceToInstance(projects));
    return;
  }

  public async findById(request: Request, response: Response) {
    const findProject = container.resolve(ShowProjectService);
    const { id } = request.params;
    const userId = request.user.id;
    const project = await findProject.execute(id, userId);

    response.json(instanceToInstance(project));
    return;
  }

  public async delete(request: Request, response: Response) {
    const deleteProject = container.resolve(DeleteProjectService);
    const { id } = request.params;

    await deleteProject.execute(id);

    response.status(204).send();
  }

  public async update(request: Request, response: Response) {
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
      tagId
    });

    response.status(200).json(instanceToInstance(project));
    return;
  }
}
