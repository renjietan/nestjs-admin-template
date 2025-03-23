import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ErrorEnum } from '~/constants/error-code.constant';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly time: number = 10000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.time),
      catchError((err) => {
        if (err instanceof TimeoutError)
          return throwError(() => new RequestTimeoutException(ErrorEnum.RequestTimeout))

        return throwError(() => err)
      }),
    )
  }
}
