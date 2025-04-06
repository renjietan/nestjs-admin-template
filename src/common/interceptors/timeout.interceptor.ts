import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly time: number = 10000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let i18n = I18nContext.current(context)
    return next.handle().pipe(
      timeout(this.time),
      catchError((err) => {
        if (err instanceof TimeoutError)
          return throwError(() => new RequestTimeoutException(i18n.t("index.System.RequestTimeout")))

        return throwError(() => err)
      }),
    )
  }
}
