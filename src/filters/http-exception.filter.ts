import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<FastifyReply<any | WritableStream>>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof exceptionResponse === 'string'
      ? { message: exceptionResponse }
      : (exceptionResponse as object);


    if (response?.writable) {
      this.handleStream(response, error, status);
    } else {
      response
        .status(status)
        .send({
          statusCode: status,
          timestamp: new Date().toISOString(),
          ...error,
        });
    }
  }

  private handleStream(response: any, error: any, status: number) {
    try {
      response.writeHead(status, { 'Content-Type': 'application/json' }); // the response is a writable stream and not a plain object, this is a bug with fastify adapter.
      response.write(JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        ...error,
      }, null, '\t'));
    } catch (exception) {
      console.error('Exception in HttpExceptionFilter', exception);
    } finally {
      response.end();
    }
  }

}
