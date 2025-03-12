import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { NetWorkTemplateDTO } from './NetWorkTemplateDTO'
import { IsNotEmpty, IsOptional } from 'class-validator'

enum n_network_template_type {
  Folder = 1,
  NET_WROK_TEMPLATE = 2,
}

export class UpdateNetWorkTemplateDTO extends PartialType(NetWorkTemplateDTO) {
  @IsNotEmpty()
  @ApiProperty({ description: '文件名称  或 模板名称', example: '文件名称  或 网络模板名称' })
  name?: string

  @IsNotEmpty()
  @ApiProperty({ enum: n_network_template_type, description: '1:文件  或 2:网络模板  不传 默认是1', example: 1, default: 1 })
  type: number

  @IsOptional()
  @ApiProperty({ description: '更新波形-传入字典Code', example: 'userRole', required: false })
  waveForm?: string

  @IsOptional()
  @ApiProperty({ description: '设备类型--传入字典Code', example: 'userRole', required: false })
  device_type?: string

  @IsOptional()
  @ApiProperty({ description: '其他参数-json字符串', example: '{params: 1, params2: \'123131\'}', required: false })
  other_conf?: string

  @IsOptional()
  @ApiProperty({ description: '调频表ID  逗号分隔的字符串', example: '23,24', required: false })
  h_table_ids?: string

  @IsOptional()
  @ApiProperty({ description: '时序表ID  逗号分隔', example: '23, 24', required: false })
  ts_ids?: string

  @IsOptional()
  @ApiProperty({ description: '传入字典ID', example: 'userRole', required: false })
  access_method?: string

  @IsOptional()
  @ApiProperty({ description: 'root节点 传0,  不传 默认是0', example: 0, default: 0, required: false })
  pId?: number
}
