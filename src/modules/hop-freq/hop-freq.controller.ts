import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import {
  InjectRepository
} from "@nestjs/typeorm";
import {
  Repository
} from "typeorm";
import {
  ApiResult
} from "~/common/decorators/api-result.decorator";
import {
  AuthUser
} from "~/common/decorators/auth/auth-user.decorator";
import {
  definePermission,
  Perm,
} from "~/common/decorators/auth/permission.decorator";
import {
  IdParam
} from "~/common/decorators/path-param.decorator";
import {
  ApiSecurityAuth
} from "~/common/decorators/swagger.decorator";
import {
  PagerDto
} from "~/common/dto/pager.dto";
import {
  FTableEntity
} from "~/entities/f-table";
import {
  CreateFreqTableDto,
  CreateHzDtos,
  CreateTableDto,
} from "./dto/create-hf.dto";
import {
  SearchHFDto
} from "./dto/search.dto";
import {
  UpdateTableDto
} from "./dto/update-hf.dto";
import {
  HopFreqService
} from "./hop-freq.service";

export const permissions = definePermission("confg:hopFreq", {
    LIST: "list",
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
  } as const);

@ApiTags("Config - 眺频表")
@ApiSecurityAuth()
@Controller("freq-table")
export class HopFreqController {
  constructor(
    private readonly f_table_seivce: HopFreqService,
    @InjectRepository(FTableEntity) private readonly f_table_entity: Repository < FTableEntity >
  ) {}

  @Patch()
  @ApiOperation({
    summary: "批量新增: 初始化 80张表时, law_conf可传空",
    description: "查看最下方 CreateFreqTableDto 参数说明",
  })
  @ApiResult({
    type: String
  })
  @Perm(permissions.CREATE)
  async init(@Body() dto: CreateFreqTableDto, @AuthUser() user: IAuthUser) {
    return await this.f_table_seivce.init(dto, user?.uid)
  }

  @Get()
  @ApiOperation({
    summary: "列表",
    description: "跳频表"
  })
  @ApiResult({
    type: [FTableEntity]
  })
  @Perm(permissions.LIST)
  async page(@Query() dto: SearchHFDto) {
    return this.f_table_seivce.page(dto);
  }

  @Get("hoppings/:f_table_id")
  @ApiOperation({
    summary: "列表",
    description: "根据跳频表新增频点"
  })
  @ApiResult({
    type: [FTableEntity]
  })
  @Perm(permissions.LIST)
  async pageByTableId(
    @Param("f_table_id") table_id: string,
    @Query() dto: PagerDto
  ) {
    return this.f_table_seivce.pageByTableId(table_id, dto);
  }

  @Post("create_hf")
  @ApiOperation({
    summary: "新增",
    description: "跳频表"
  })
  @ApiResult({
    type: CreateTableDto
  })
  @Perm(permissions.CREATE)
  async create_hf(@Body() dto: CreateTableDto, @AuthUser() user: IAuthUser) {
    return this.f_table_seivce.create_hF(dto, user?.uid);
  }

  @Put("update_hf/:id")
  @ApiOperation({
    summary: "更新",
    description: "跳频表: 所有参数非必传",
  })
  @ApiResult({
    type: String
  })
  @Perm(permissions.UPDATE)
  async update_hf(
    @IdParam() id: string,
    @Body() dto: UpdateTableDto,
    @AuthUser() user: IAuthUser
  ) {
    return this.f_table_seivce.update_hf(+id, dto, user?.uid);
  }

  @Delete("delete_hf/:id")
  @ApiOperation({
    summary: "删除",
    description: "跳频表",
  })
  @ApiResult({
    type: String
  })
  @Perm(permissions.DELETE)
  async delete_hf(@IdParam() id: string) {
    return this.f_table_seivce.delete_hf(+id);
  }

  @Patch("create_hz/:table_id")
  @ApiOperation({
    summary: "批量新增",
    description: `频点表: 
      allow-clean = 1  代表插入数据前,是否需要根据[tableId]删除眺频表的数据
    `,
  })
  @ApiResult({
    type: String
  })
  @Perm(permissions.CREATE)
  async create_hz(
    @Param("table_id") table_id: string,
    @Body() dto: CreateHzDtos,
    @AuthUser() user: IAuthUser
  ) {
    dto.allow_clean = dto?.allow_clean ?? 1
    return this.f_table_seivce.create_hz(+table_id, dto, user?.uid);
  }
}