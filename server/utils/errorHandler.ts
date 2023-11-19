class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, stack: string | undefined='') {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;