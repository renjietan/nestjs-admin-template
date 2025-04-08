import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResult } from "~/common/decorators/api-result.decorator";
import { AuthUser } from "~/common/decorators/auth/auth-user.decorator";
import {
  definePermission,
  Perm,
} from "~/common/decorators/auth/permission.decorator";
import { IdParam } from "~/common/decorators/path-param.decorator";
import { MasterEntity } from "~/entities/t_master";
import { MasterDto, SubDto } from "./dto/mission_planning.dto";
import { MissionPlanningService } from "./mission_planning.service";

export const permissions = definePermission("t:mission", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const);

@ApiTags("MissionPlanning - 任务规划")
@Controller("mission-planning")
export class MissionPlanningController {
  constructor(
    private readonly missionPlanningService: MissionPlanningService
  ) {}

  @ApiOperation({
    summary: "列表",
  })
  @ApiResult({ type: MasterEntity, isPage: true })
  @Get()
  findAll() {
    return this.missionPlanningService.findAll();
  }

  @ApiOperation({
    summary: "新增任务规划",
    description: "字段信息: 查询下方MasterDto",
  })
  @ApiResult({ type: MasterDto })
  @Perm(permissions.CREATE)
  @Post()
  async create(@Body() dto: MasterDto, @AuthUser() user: IAuthUser) {
    return await this.missionPlanningService.create(dto, user?.uid);
  }

  @ApiOperation({
    summary: "编辑任务规划",
    description: "字段信息: 查询下方 MasterDto",
  })
  @ApiResult({ type: String })
  @Perm(permissions.UPDATE)
  @Put(":id")
  @ApiParam({
    type: String,
    name: "id"
  })
  async update(@IdParam() id, @Body() dto: MasterDto, @AuthUser() user: IAuthUser) {
    return await this.missionPlanningService.update(id, dto, user?.uid);
  }

  @ApiOperation({
    summary: "删除任务规划",
  })
  @ApiResult({ type: String })
  @Delete(":id")
  @Perm(permissions.DELETE)
  remove(@Param("id") id: string) {
    return this.missionPlanningService.remove(+id);
  }
  
  /** ======================== 子任务 =============================== */
  
  @ApiOperation({
    summary: "新增子任务",
    description: "字段信息: 查询下方 SubDto",
  })
  @ApiResult({ type: SubDto })
  @Perm(permissions.CREATE)
  @Post("sub/:mId")
  @ApiParam({
    type: String,
    name: "mId"
  })
  async create_sub(@Param("mId") mId: string, @Body() dto: SubDto, @AuthUser() user: IAuthUser) {
    return await this.missionPlanningService.create_sub(+mId, dto, user?.uid ?? 1);
  }

  @ApiOperation({
    summary: "更新子任务",
    description: "字段信息: 查询下方 SubDto",
  })
  @ApiResult({ type: SubDto })
  @Perm(permissions.UPDATE)
  @Put("sub/:id")
  @ApiParam({
    type: String,
    name: "id"
  })
  async update_sub(@IdParam() id: string, @Body() dto: SubDto, @AuthUser() user: IAuthUser) {
    return await this.missionPlanningService.update_sub(+id, dto, user?.uid ?? 1);
  }

  @ApiOperation({
    summary: "删除子任务",
  })
  @ApiResult({ type: String })
  @Perm(permissions.DELETE)
  @Delete("sub/:id")
  @ApiParam({
    type: String,
    name: "id"
  })
  async remove_sub(@IdParam() id: string) {
    return await this.missionPlanningService.remove_sub(+id);
  }

  @ApiOperation({
    summary: "设置设备 主台",
  })
  @ApiResult({ type: String })
  @Perm(permissions.UPDATE)
  @Delete("setDeviceMaster/:id")
  @ApiParam({
    type: String,
    name: "id"
  })
  async setDeviceMaster(@IdParam() id: number) {
    return await this.missionPlanningService.setDeviceMaster(id);
  }
}
