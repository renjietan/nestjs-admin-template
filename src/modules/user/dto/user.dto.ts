import { ApiExcludeController, ApiExcludeEndpoint, ApiHideProperty, ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { isEmpty } from 'lodash'

import { PagerDto } from '~/common/dto/pager.dto'

export class UserDto {

  @ApiProperty({ description: '登录账号', example: 'admin' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @ApiProperty({ description: '登录密码', example: 'a123456' })
  @IsOptional()
  password: string

  @ApiHideProperty()
  @ApiProperty({ description: '归属角色', type: [Number], required: false })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roleIds: number[]

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

export class UserQueryDto extends IntersectionType(PagerDto<UserDto>, PartialType(UserDto)) {
  @ApiProperty({ description: '状态', example: 0, required: false })
  @IsInt()
  @IsOptional()
  status?: number
}
