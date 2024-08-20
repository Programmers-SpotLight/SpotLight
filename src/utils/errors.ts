import { AxiosError } from "axios";

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

export function handleHttpError(error: AxiosError): never {
  const status = error.response?.status;

  switch (status) {
    case 403:
      throw new ForbiddenError("엑세스 권한이 없습니다.");
    case 404:
      throw new NotFoundError("요청한 리소스를 찾을 수 없습니다.");
    case 500:
    default:
      throw new InternalServerError("서버에서 오류가 발생했습니다.");
  }
}
