import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordMailUseCase } from './sendForgotPasswordMailUseCase';

class SendForgotPasswordMailController {
  async handle(request: Request, respone: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase
    );

    await sendForgotPasswordMailUseCase.execute(email);

    return respone.send();
  }
}

export { SendForgotPasswordMailController };
