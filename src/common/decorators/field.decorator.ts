import { applyDecorators } from '@nestjs/common'
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { isNumber } from 'lodash'

import {
  ToArray,
  ToBoolean,
  ToDate,
  ToLowerCase,
  ToNumber,
  ToTrim,
  ToUpperCase,
} from './transform.decorator'

interface IOptionalOptions {
  required?: boolean
}

interface INumberFieldOptions extends IOptionalOptions {
  each?: boolean // 如果是数组，设置为 true， 检验数组中每个数字
  int?: boolean // 是否为整数
  min?: number // 最小值
  max?: number // 最大值
  positive?: boolean // 检验是否为正数
}

interface IStringFieldOptions extends IOptionalOptions {
  each?: boolean // 如果是数组，设置为 true， 检验数组中每个字符串
  minLength?: number // 最小长度
  maxLength?: number // 最大长度
  lowerCase?: boolean // 小写 转换
  upperCase?: boolean // 大写 转换
}

export function NumberField(
  options: INumberFieldOptions = {},
): PropertyDecorator {
  const { each, min, max, int, positive, required = true } = options

  const decorators = [ToNumber()]

  if (each)
    decorators.push(ToArray())

  if (int)
    decorators.push(IsInt({ each }))
  else
    decorators.push(IsNumber({}, { each }))

  if (isNumber(min))
    decorators.push(Min(min, { each }))

  if (isNumber(max))
    decorators.push(Max(max, { each }))

  if (positive)
    decorators.push(IsPositive({ each }))

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

export function StringField(
  options: IStringFieldOptions = {},
): PropertyDecorator {
  const {
    each,
    minLength,
    maxLength,
    lowerCase,
    upperCase,
    required = true,
  } = options

  const decorators = [IsString({ each }), ToTrim()]

  if (each)
    decorators.push(ToArray())

  if (isNumber(minLength))
    decorators.push(MinLength(minLength, { each }))

  if (isNumber(maxLength))
    decorators.push(MaxLength(maxLength, { each }))

  if (lowerCase)
    decorators.push(ToLowerCase())

  if (upperCase)
    decorators.push(ToUpperCase())

  if (!required)
    decorators.push(IsOptional())
  else
    decorators.push(IsNotEmpty({ each }))

  return applyDecorators(...decorators)
}

export function BooleanField(
  options: IOptionalOptions = {},
): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()]

  const { required = true } = options

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

export function DateField(options: IOptionalOptions = {}): PropertyDecorator {
  const decorators = [ToDate(), IsDate()]

  const { required = true } = options

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

export function IpAddressField(options: IOptionalOptions = {}): PropertyDecorator {
  const decorators = [IsIP()]

  const { required = true } = options

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

