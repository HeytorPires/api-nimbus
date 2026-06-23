import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import LogoutService from '../../../services/LogoutService';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSessionsService = container.resolve(CreateSessionsService);

    const result = await createSessionsService.execute({ email, password });
    return response.json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const logoutService = container.resolve(LogoutService);
    await logoutService.execute(request.user.id);
    return response.status(204).json();
  }
}

export default SessionsController;
