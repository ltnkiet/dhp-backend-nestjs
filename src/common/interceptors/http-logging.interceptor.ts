import { stringUtils } from 'mvc-common-toolkit';
import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { getLogId } from '@common/decorators/logging';
import { AppRequest } from '@common/interfaces';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(this.constructor.name, { timestamp: true });

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: AppRequest = context.switchToHttp().getRequest();
    const logId = getLogId(request);

    this.logger.debug(
      `[${logId}]: Request: ${request.method} ${request.url} ${request.body ? JSON.stringify(request.body, stringUtils.maskFn) : ''}`,
    );

    return next.handle().pipe(
      tap((responseBody) => {
        this.logger.debug(
          `[${logId}]: Response: ${JSON.stringify(
            responseBody,
            stringUtils.maskFn,
          )}`,
        );
      }),
    );
  }
}
