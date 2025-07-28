import { Request, Response } from 'express';
import ResetPasswordService from '../../../services/ResetPasswordservice';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async Reset(request: Request, response: Response) {
    const { password, token } = request.body;
    const sendForgotPasswordEmail = container.resolve(ResetPasswordService);

    const user = await sendForgotPasswordEmail.execute({ token, password });

    response.status(204).json(user);
    return;
  }
}
