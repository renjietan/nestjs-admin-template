import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { PagerDto } from '~/common/dto/pager.dto'

export class SearcheWaveDeviceConfigDto extends PagerDto {
  @IsOptional()
  @ApiProperty({ description: '设备型号,多个类型用逗号分隔、不传查询全部', example: 'PMR200', required: false })
  deviceModel: string

  @IsOptional()
  @ApiProperty({ description: '波形类型: 多个类型用逗号分隔、不传查询全部', example: 'FF,FM', required: false })
  waveTypes: string
}
