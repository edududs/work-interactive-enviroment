import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { NotFoundError } from '../application/errors.js';

/** Turns the application's "does not exist" into HTTP 404, so use cases never know about HTTP. */
@Catch(NotFoundError)
export class NotFoundFilter implements ExceptionFilter<NotFoundError> {
  catch(error: NotFoundError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(HttpStatus.NOT_FOUND)
      .json({ statusCode: HttpStatus.NOT_FOUND, message: error.message });
  }
}
