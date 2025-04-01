import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches
} from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'
import { ErrorEnum } from '~/constants/error-code.constant'

export class UserDto {

  @ApiProperty({ description: '登录账号', example: 'admin' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{4,20}$/, {
    message: ErrorEnum.UsernameFailed
  })
  username: string

  @ApiProperty({ description: '登录密码', example: 'a123456' })
  @IsOptional()
  password: string

  @ApiProperty({ description: '归属角色', type: [Number], required: false })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roleIds: number[]

  @ApiProperty({ description: '如果角色与权限 无需 保存在后端， 使用此接口', required: false })
  @IsString()
  @IsOptional()
  role_id?: string

  @ApiProperty({ description: '呢称', example: 'admin' })
  @IsOptional()
  @IsString()
  nickname: string

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserQueryDto extends IntersectionType(PagerDto<UserDto>) {
  @ApiProperty({ description: '登录账号', example: 'admin' })
  @IsString()
  @IsOptional()
  username?: string

  @ApiProperty({ description: '状态', example: 0, required: false })
  @IsInt()
  @IsOptional()
  status?: number

  @ApiProperty({ description: '呢称', example: 'admin' })
  @IsString()
  @IsOptional()
  nickname?: string
}
