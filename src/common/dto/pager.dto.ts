import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { Allow, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Exact {
  TRUE = 1,
  FALSE = 0,
}

export class OrderDto {
  @ApiProperty({ description: '按照XX字段进行排序' })
  @IsString()
  @IsOptional()
  field?: string // | keyof T

  @ApiProperty({ enum: Order, description: '排序方式' })
  @IsEnum(Order)
  @IsOptional()
  @Transform(({ value }) => (value === 'asc' ? Order.ASC : Order.DESC))
  order?: Order
}

export class PagerDto<T = any> extends OrderDto {
  @ApiProperty({ minimum: 1, default: 1 })
  @Min(1)
  @IsInt()
  @Expose()
  @IsOptional({ always: true })
  @Transform(({ value: val }) => (val ? Number.parseInt(val) : undefined), {
    toClassOnly: true,
  })
  page?: number

  @ApiProperty({ minimum: 1, maximum: 100, default: 10 })
  @Min(1)
  @Max(100)
  @IsInt()
  @IsOptional({ always: true })
  @Expose()
  @Transform(({ value: val }) => (val ? Number.parseInt(val) : undefined), {
    toClassOnly: true,
  })
  pageSize?: number

  @Allow()
  _t?: number
}
