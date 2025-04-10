import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class RequtesLoggerInterceptor implements NestInterceptor {
  private static readonly logger = new Logger('HTTP');

  private readonly reflector: Reflector = new Reflector();

  constructor() {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const start = new Date().getTime();
    const data_privacy = this.reflector.get<boolean>('logger-data-privacy', context.getHandler());

    const requestId = Math.random().toString(36).substring(2, 15);
    RequtesLoggerInterceptor.logger.log('Request intercepted', {
      requestId,
      context: context.getHandler().name,
      data_privacy: Number(data_privacy),
      host: request.headers.host,
      path: request.originalUrl,
      query: request._parsedUrl.query,
      method: request.method,
      referer: request.referer,
      useragent: request.headers['user-agent'],
      httpversion: request.httpVersion,
      forwardedFor: request.headers['x-forwarded-for'],
    });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        RequtesLoggerInterceptor.logger.log('Response intercepted', {
          requestId,
          context: context.getHandler().name,
          data_privacy: Number(data_privacy),
          status: response.statusCode,
          duration: new Date().getTime() - start,
        });
      }),
      catchError((err) => {
        RequtesLoggerInterceptor.logger.error(err.message, err.stack, context.getHandler().name);
        return throwError(() => err);
      }),
    );
  }
}
