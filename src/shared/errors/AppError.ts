export default class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly context: string;
  public readonly cause?: string;

  constructor(
    message: string,
    context: string,
    statusCode = 400,
    cause?: string
  ) {
    this.message = message;
    this.cause = cause;
    this.context = context;
    this.statusCode = statusCode;
  }
}
