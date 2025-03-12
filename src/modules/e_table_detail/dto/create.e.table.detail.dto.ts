import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateEncryptDto {
  @IsNotEmpty({
    message: 'encrypt_pwd cannot be empty',
  })
  @ApiProperty({ description: '密钥', example: '64个数字(32个16进制)' })
  encrypt_pwd: string

  @IsNotEmpty({
    message: 'channelNo cannot be empty',
  })
  @ApiProperty({ description: '信道(采用第几个信道表,非信道ID)', example: '1' })
  channelNo: number

  @IsNotEmpty({
    message: 'startDate cannot be empty',
  })
  @ApiProperty({ description: '开始生效日期', example: '2024-01-01' })
  startDate: string

  @IsInt({
    message: 'Please enter a number',
  })
  @IsNotEmpty({
    message: 'days cannot be empty',
  })
  @ApiProperty({ description: '生效天数', example: 20 })
  days: number

  @IsNotEmpty({
    message: 'waveType cannot be empty',
  })
  @ApiProperty({ description: '波形类型: MR9530(11-500), MR9560(16)', example: 'MR9530' })
  waveType: string

  @IsNotEmpty({
    message: 'tableId cannot be empty',
  })
  @ApiProperty({ description: '表ID', example: 20 })
  tableId: number

  @IsNotEmpty({
    message: 'createById cannot be empty',
  })
  @ApiProperty({ description: '创建者ID', example: 1 })
  createById: number

  @IsNotEmpty({
    message: 'createById cannot be empty',
  })
  @ApiProperty({ description: '不用传', example: '2024-12-02' })
  updateTime: string
}
