import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { NumberField, StringField } from '~/common/decorators/field.decorator'
import { ToArray, ToLowerCase, ToUpperCase } from '~/common/decorators/transform.decorator'
import { OperatorDto } from '~/common/dto/operator.dto'

export class TestCreateDto extends OperatorDto {
  @ApiProperty({
    description: '数字-数组',
    example: [1],
  })
  @NumberField({
    each: true,
  })
  arr_num: number[]

  @ApiProperty({
    description: '数字',
    example: 1,
  })
  @NumberField({
    min: 1,
    max: 3,
    int: true,
    positive: true,
  })
  num: number

  @ApiProperty({
    description: '字符串-数组',
    example: [1],
  })
  @StringField({
    each: true,
  })
  arr_str: string[]

  @ApiProperty({
    description: '字符串',
    example: 1,
  })
  @StringField({
    minLength: 1,
    maxLength: 3,
    lowerCase: true,
    upperCase: false,
  })
  str: string

  @ApiProperty({
    description: '转 小写字符串',
    example: 'String',
  })
  @IsNotEmpty()
  @ToLowerCase()
  str_low: string

  @ApiProperty({
    description: '转 大写字符串',
    example: 'string',
  })
  @IsNotEmpty()
  @ToUpperCase()
  str_up: string

  @ApiProperty({
    description: '转 数组',
    example: '1,2,3,4',
  })
  @IsNotEmpty()
  @ToArray()
  str_arr: string
}
