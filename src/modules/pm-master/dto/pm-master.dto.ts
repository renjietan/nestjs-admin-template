import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PMMasterDto {
  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-名称', example: '任务规划-主任务-名称' })
  pm_name: string

  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-开始时间', example: '2025-02-01' })
  pm_startTime: string

  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-结束时间', example: '2026-02-01' })
  pm_endTime: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-组织机构ID', example: 1 })
  pm_orgId: number

  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-任务描述', example: '任务规划-主任务-任务描述', required: false })
  pm_Desc: string
}
