import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { TimeSlotDto } from './dto/time-slot.dto';
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
    summary: "新增/编辑",
    description: "编辑需传入id"
  })
  @Perm([permissions.CREATE, permissions.UPDATE])
  @ApiResult({ type: TimeSlotDto })
  @Post()
  async create(@Body() dto: TimeSlotDto, @AuthUser() user: IAuthUser) {
    return await this.timeSlotService.create(dto, user?.uid);
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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.timeSlotService.remove(+id);
  }
}
