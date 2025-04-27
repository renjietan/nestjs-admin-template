import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { IdParam } from '~/common/decorators/path-param.decorator';
import { IdsDto } from '~/common/dto/ids.dto';
import { PointsDto, TimeSlotDto } from './dto/time-slot.dto';
import { TimeSlotService } from './time-slot.service';

export const permissions = definePermission("t:timeSlot", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const);

@ApiTags("TimeSlot - 时隙表")
@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @ApiOperation({
    summary: "新增",
  })
  @Perm(permissions.CREATE)
  @ApiResult({ type: TimeSlotDto })
  @Post()
  async create(@Body() dto: TimeSlotDto, @AuthUser() user: IAuthUser) {
    return await this.timeSlotService.create(dto, user?.uid);
  }

  @ApiOperation({
    summary: "更新 ",
  })
  @Perm(permissions.UPDATE)
  @Put(":id")
  async update(@IdParam() id: number, @Body() dto: PointsDto, @AuthUser() user: IAuthUser) {
    return await this.timeSlotService.update(id, dto, user?.uid);
  }

  @ApiOperation({
    summary: "列表",
  })
  @Perm(permissions.LIST)
  @ApiResult({ type: [TimeSlotDto], isPage: true })
  @Get()
  async findAll() {
    return await this.timeSlotService.findAll();
  }

  @ApiOperation({
    summary: "删除",
  })
  @Perm(permissions.DELETE)
  @Delete()
  async remove(@Body() dto: IdsDto) {
    await this.timeSlotService.remove(dto);
  }
}
