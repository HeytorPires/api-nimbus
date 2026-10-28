import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowEmailService from '@modules/emails/services/ShowEmailService';
import UpdateEmailStatusService from '@modules/emails/services/UpdateEmailStatusService';
import { EmailEventSource } from '@modules/emails/domain/enums/EmailStatus';

export default class EmailsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showEmail = container.resolve(ShowEmailService);
    const email = await showEmail.execute(id);

    return response.json(email);
  }

  public async updateStatus(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;
    const { status } = request.body;
    const updateEmailStatus = container.resolve(UpdateEmailStatusService);
    await updateEmailStatus.execute({
      emailId: id,
      status,
      source: EmailEventSource.MANUAL,
    });

    // Reaproveita o show para responder com o mesmo DTO (status + histórico)
    const showEmail = container.resolve(ShowEmailService);
    const email = await showEmail.execute(id);

    return response.json(email);
  }
}
