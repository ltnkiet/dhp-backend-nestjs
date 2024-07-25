import {
  AuditService,
  ErrorLog,
  HttpResponse,
  stringUtils,
} from 'mvc-common-toolkit';
import { Observable, catchError, map, of } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { APP_ACTION, ERR_CODE, HEADER_KEY } from '@common/constants';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  protected logger = new Logger(HttpResponseInterceptor.name);

  constructor(protected auditService: AuditService) {}

  public intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const httpReq: any = ctx.switchToHttp().getRequest();
    const user = httpReq.activeUser || httpReq.user;
    const logId = ctx.switchToHttp().getRequest().headers[HEADER_KEY.LOG_ID];

    return next.handle().pipe(
      map((response: HttpResponse) => {
        if (response?.httpCode) {
          return response;
        }

        if (response?.success === false) {
          return {
            success: false,
            code: response.code,
            httpCode: response.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
            message: response.message,
          };
        }

        if (response?.success === true) {
          delete response.success;
        }

        const payload = response?.data ?? response;

        return { data: payload, success: true };
      }),
      catchError((error) => {
        this.logger.error(error.message, error.stack);

        if (!(error instanceof HttpException)) {
          this.auditService.emitLog(
            new ErrorLog({
              logId,
              action: APP_ACTION.HANDLE_EXCEPTION,
              message: error.message,
              userId: user?.id || 'unknown',
              metadata: {
                url: httpReq.url,
                user: JSON.stringify(user, stringUtils.maskFn),
                payload: httpReq.body
                  ? JSON.stringify(httpReq.body, stringUtils.maskFn)
                  : '',
              },
            }),
          );

          return of({
            success: false,
            message: 'internal server error',
            code: ERR_CODE.INTERNAL_SERVER_ERROR,
          });
        }

        return of(error);
      }),
    );
  }
}
