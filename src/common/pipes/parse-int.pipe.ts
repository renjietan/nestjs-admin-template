import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { ErrorEnum } from '~/constants/error-code.constant'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = Number.parseInt(value, 10)
    if (Number.isNaN(val))
      throw new BadRequestException(ErrorEnum.InvalidIdFormat)

    return val
  }
}
