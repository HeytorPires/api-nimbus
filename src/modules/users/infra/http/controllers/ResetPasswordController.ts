import { Request, Response } from 'express';
import ResetPasswordService from '../../../services/ResetPasswordservice';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async reset(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;
    const resetPasswordService = container.resolve(ResetPasswordService);

    const user = await resetPasswordService.execute({ token, password });

    return response.status(204).json(user);
  }
}
