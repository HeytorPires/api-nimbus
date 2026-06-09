import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSessionsService = container.resolve(CreateSessionsService);

    const user = await createSessionsService.execute({ email, password });
    return response.json(user);
  }
}

export default SessionsController;
