import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { ApiResult } from "~/common/decorators/api-result.decorator";
import { AuthUser } from "~/common/decorators/auth/auth-user.decorator";
import {
  definePermission,
  Perm,
} from "~/common/decorators/auth/permission.decorator";
import { IdParam } from "~/common/decorators/path-param.decorator";
import { PMSubEntity } from "~/entities/pm_sub";
import { PMSubNetWorkDeviceEntity } from "~/entities/pm_sub_network_device";
import { CompleteDto } from "./dto/complete.dto";
import { SubNetWorkDeviceDto } from "./dto/sub-network-device.dto";
import { SubDto } from "./dto/sub.dto";
import { PmSubService } from "./pm-sub.service";

export const permissions_sub = definePermission("pm:sub", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const);

export const permissions_net = definePermission("pm:sub", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const);

@ApiTags("Task - 子任务")
@Controller("pm-sub")
export class PmSubController {
  constructor(private readonly pmSubService: PmSubService) {}

  @ApiOperation({
    summary: "列表",
    description: '子任务-基础信息'
  })
  @Get()
  @Perm(permissions_sub.LIST)
  @ApiResult({ type: SubDto })
  async search() {
    return await this.pmSubService.search();
  }

  @Patch("complete/:mId")
  @ApiOperation({
    summary: "批量",
    description: '子任务 + 设备;传ID为更新;不传则为新增'
  })
  @Perm(permissions_sub.CREATE)
  @ApiResult({ type: PMSubEntity })
  @ApiParam({ name: 'mId' })
  async complete(@Param("mId") mId: number, @Body() dto: CompleteDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubService.complete(mId, dto, user?.uid)
  }

  @Post("sub/:mId")
  @ApiOperation({
    summary: "新增",
    description: '子任务-基础信息'
  })
  @Perm(permissions_sub.CREATE)
  @ApiResult({ type: PMSubEntity })
  @ApiParam({
    name: 'mId',
    type: String,
    description: "任务规划id"
  })
  async create_sub(@Param("mId") mId, @Body() data: SubDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubService.create_sub(mId, data, user?.uid);
  }

  @Put(":id")
  @ApiOperation({
    summary: "更新",
    description: '子任务-基础信息'
  })
  @Perm(permissions_sub.UPDATE)
  @ApiResult({ type: UpdateResult })
  @ApiParam({
    name: "id",
    type: String,
    description: "子任务ID"
  })
  async update_sub(
    @IdParam() id,
    @Body() data: SubDto,
    @AuthUser() user: IAuthUser
  ) {
    return await this.pmSubService.update_sub(id, data, user?.uid);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "删除",
    description: '包含设备的删除'
  })
  @Perm(permissions_sub.DELETE)
  @ApiResult({ type: DeleteResult })
  @ApiParam({
    name: "id",
    type: String,
    description: '子任务ID'
  })
  async delete(@IdParam() id) {
    return await this.pmSubService.delete_sub(id);
  }

  @Post("network-device/:sId")
  @ApiOperation({
    summary: "新增",
    description: '子任务-设备'
  })
  @Perm(permissions_net.CREATE)
  @ApiResult({ type: PMSubNetWorkDeviceEntity })
  @ApiParam({
    name: "sId",
    type: String,
    description: "子任务ID"
  })
  async create_network_devices(@Param("sId") sId,@Body() data: SubNetWorkDeviceDto,@AuthUser() user: IAuthUser) {
    return await this.pmSubService.create_network_device(sId, data, user?.uid);
  }

  @Put("network-device/:id")
  @ApiOperation({
    summary: "更新",
    description: '子任务-设备'
  })
  @Perm(permissions_net.UPDATE)
  @ApiResult({ type: PMSubNetWorkDeviceEntity })
  @ApiParam({ name: "id", type: String, description: 'network device id' })
  async update_network_devices(@IdParam() id,@Body() data: SubNetWorkDeviceDto,@AuthUser() user: IAuthUser) {
    return await this.pmSubService.update_network_device(id, data, user?.uid);
  }
  
  @Delete("network-device/:id")
  @ApiOperation({
    summary: "更新",
    description: '子任务-设备'
  })
  @Perm(permissions_net.UPDATE)
  @ApiResult({ type: PMSubNetWorkDeviceEntity })
  @ApiParam({ name: "id", type: String, description: 'network device id' })
  async delete_network_devices(@IdParam() id) {
    return await this.pmSubService.delete_network_device(id);
  }
}
