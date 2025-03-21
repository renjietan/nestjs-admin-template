import {
  HttpStatus,
  NotAcceptableException,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { ErrorEnum } from '~/constants/error-code.constant'

export function IdParam() {
  return Param(
    'id',
    new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      exceptionFactory: (_error) => {
        throw new NotAcceptableException(ErrorEnum.InvalidIdFormat)
      },
    }),
  )
}
