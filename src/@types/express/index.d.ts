declare namespace Express {
  export interface Request {
    id?: string;
    // Corpo bruto, necessário para validar a assinatura de webhooks
    rawBody?: Buffer;
    user: {
      id: string;
    };
  }
}
