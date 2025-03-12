import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PMSubDto } from './pm-sub.dto'

export class BasePMSubDto extends PartialType(PMSubDto) {
  @ApiProperty({ description: '任务规划-子任务-ID', example: 1, required: false })
  pm_sub_id: number

  @IsNotEmpty({
    message: 'ip_addr cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-名称', example: '任务规划-子任务-名称' })
  pm_sub_name: string

  @IsNotEmpty({
    message: 'network_addr cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-开始时间', example: '2025-01-01' })
  pm_sub_startTime: string

  @IsNotEmpty({
    message: 'pm_sub_endTime cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-结束时间', example: '2025-12-01' })
  pm_sub_endTime: string

  @IsNotEmpty({
    message: 'pm_sub_desc cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-备注', example: '任务规划-子任务-备注' })
  pm_sub_desc: string
}
