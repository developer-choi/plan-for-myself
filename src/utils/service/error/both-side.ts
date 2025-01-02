export class ValidateError extends Error {
  title?: string;
  reason?: string;

  constructor(message: string, config?: {title?: string, reason?: string}) {
    super(message);
    this.title = config?.title;
    this.reason = config?.reason;
  }
}

export class InvalidEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
  }
}
