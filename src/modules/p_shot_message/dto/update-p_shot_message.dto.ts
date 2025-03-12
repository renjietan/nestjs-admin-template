import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreatePShotMessageDto } from './create-p_shot_message.dto'

export class UpdatePShotMessageDto extends PartialType(CreatePShotMessageDto) {
  @IsNotEmpty()
  @ApiProperty({ description: '短信内容', example: '短信内容' })
  text_message: string
}
