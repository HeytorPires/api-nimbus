export default class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly context: string;

  constructor(message: string, context: string, statusCode = 400) {
    this.message = message;
    this.context = context;
    this.statusCode = statusCode;
  }
}
