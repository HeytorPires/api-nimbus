import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import CreateTagService from '@modules/tags/services/CreateTagService';
import ListTagService from '@modules/tags/services/ListTagService';
import ShowTagService from '@modules/tags/services/ShowTagService';
import UpdateTagService from '@modules/tags/services/UpdateTagService';
import DeleteTagService from '@modules/tags/services/DeleteTagService';

export default class TagsController {
  public async create(request: Request, response: Response) {
    const { name } = request.body;
    const userId = request.user.id;
    const createTags = container.resolve(CreateTagService);
    const tag = await createTags.execute({ name, userId });

    response.json(instanceToInstance(tag));
    return;
  }

  public async list(request: Request, response: Response) {
    const listTags = container.resolve(ListTagService);
    const userId = request.user.id;
    const { perPage, currentPage } = request.query;
    const tags = await listTags.execute(
      userId,
      Number(perPage),
      Number(currentPage)
    );

    response.json(instanceToInstance(tags));
    return;
  }

  public async findById(request: Request, response: Response) {
    const showTag = container.resolve(ShowTagService);
    const { id } = request.params;
    const userId = request.user.id;
    const tag = await showTag.execute(id, userId);

    response.json(instanceToInstance(tag));
    return;
  }

  public async delete(request: Request, response: Response) {
    const deleteTag = container.resolve(DeleteTagService);
    const { id } = request.params;

    await deleteTag.execute(id);

    response.status(204).send();
  }

  public async update(request: Request, response: Response) {
    const updateTag = container.resolve(UpdateTagService);
    const { id } = request.params;
    const { name } = request.body;
    const userId = request.user.id;
    const tag = await updateTag.execute({ id, name, userId });

    response.json(instanceToInstance(tag));
    return;
  }
}

