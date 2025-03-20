import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class UpdateEncryptDto {
  @IsNotEmpty({
    message: 'encrypt_pwd cannot be empty',
  })
  @ApiProperty({ description: '密钥', example: '64个数字(32个16进制)' })
  encrypt_pwd: string

  @IsInt({
    message: 'channelNo must be number',
  })
  @IsNotEmpty()
  @ApiProperty({ description: '信道(采用第几个信道表,非信道ID)', example: 1 })
  channelNo: number

  @IsNotEmpty()
  @ApiProperty({ description: '信道(采用第几个信道表,非信道ID)', example: 1 })
  isDelete: number
}
