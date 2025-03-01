import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'

export class IdsDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[]
}
