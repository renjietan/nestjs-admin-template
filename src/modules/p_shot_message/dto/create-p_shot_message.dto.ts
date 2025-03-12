import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreatePShotMessageDto {
  @IsNotEmpty({
    message: 'text_message cannot be empty',
  })
  @ApiProperty({ description: '短信内容', example: '短信内容' })
  text_message: string
}
