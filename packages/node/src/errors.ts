export class RefportError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "RefportError";
    this.status = status;
    this.code = code;
  }
}

export class RefportAuthError extends RefportError {
  constructor(message: string) {
    super(401, "UNAUTHORIZED", message);
    this.name = "RefportAuthError";
  }
}

export class RefportNotFoundError extends RefportError {
  constructor(message: string) {
    super(404, "NOT_FOUND", message);
    this.name = "RefportNotFoundError";
  }
}

export class RefportValidationError extends RefportError {
  constructor(message: string) {
    super(422, "VALIDATION_ERROR", message);
    this.name = "RefportValidationError";
  }
}

export class RefportRateLimitError extends RefportError {
  constructor(message: string) {
    super(429, "RATE_LIMITED", message);
    this.name = "RefportRateLimitError";
  }
}
