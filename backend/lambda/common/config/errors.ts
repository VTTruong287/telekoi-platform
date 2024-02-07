export class ErrorWithStatus extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const NOT_ALLOWED_CORS = new ErrorWithStatus("NOT_ALLOWED_CORS", 404);
export const ID_REQUIRED = new ErrorWithStatus("ID_REQUIRED", 400);
export const FORBIDDEN = new ErrorWithStatus("FORBIDDEN", 403);
