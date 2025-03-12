import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { NetWorkTemplateDTO } from './NetWorkTemplateDTO'

enum n_network_template_type {
  Folder = 1,
  NET_WROK_TEMPLATE = 2,
}

export class SearchNetWorkTemplateDto extends PartialType(NetWorkTemplateDTO) {
  @ApiProperty({ description: '文件名称  或 模板名称', example: '文件名称  或 网络模板名称', required: false })
  name: string

  @ApiProperty({ enum: n_network_template_type, description: '1:文件  或 2:网络模板  不传 默认是1', example: 1, default: 1, required: false })
  type: number
}
