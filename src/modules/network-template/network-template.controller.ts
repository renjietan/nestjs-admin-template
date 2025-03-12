import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { instanceToPlain } from 'class-transformer'
import { UpdateNetWorkTemplateDTO } from './dto/update.dto'
import { SearchNetWorkTemplateDto } from './dto/search.dto'
import { NetWorkTemplateDTO } from './dto/NetWorkTemplateDTO'
import { NetworkTemplateService } from './network-template.service'
import { DictItemModule } from '../system/dict-item/dict-item.module'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { parseArrayToTree } from '~/utils'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { NNetWorkTemplateEntity } from '~/entities/n_network_template'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { UpdateResult } from 'typeorm'


export const permissions = definePermission('network:template', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Network - 网络模板')
@Controller('network-template')
export class NetworkTemplateController {
  constructor(
    private readonly networkTemplateService: NetworkTemplateService,
  ) { }

  @ApiOperation({
    summary: '新增 文件 或 模板',
  })
  @Post()
  @ApiResult({ type: NNetWorkTemplateEntity })
  @Perm(permissions.CREATE)
  async create(@Query() data: NetWorkTemplateDTO, @AuthUser() user:IAuthUser) {
    return await this.networkTemplateService.create(user?.uid, data)
  }

  @ApiOperation({
    summary: '更新: 参数说明 查看下方 UpdateNetWorkTemplateDTO, 不需要更新的字段，不传',
  })
  @Put('update/:id')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: string, @Body() data: UpdateNetWorkTemplateDTO, @AuthUser() user:IAuthUser) {
    return await this.networkTemplateService.update(+id, data, user?.uid)
  }

  @ApiOperation({
    summary: '列表: 根据名称搜索, 不传查所有',
  })
  @Get()
  @ApiResult({ type: [NNetWorkTemplateEntity] })
  @Perm(permissions.LIST)
  async findBy(@Query() data: SearchNetWorkTemplateDto) {
    const res = await this.networkTemplateService.findBy(data)
    const items = res?.items ?? []
    let res_arr = instanceToPlain(items)
    res_arr = res_arr.map((item) => {
      const h_table_ids = (item?.h_table_ids ?? '').split(',')
      return {
        ...item,
        h_table_ids,
      }
    })
    const _res = parseArrayToTree(res_arr)
    return _res
  }

  @ApiOperation({
    summary: '根据id 删除',
  })
  @Delete('delete/:id')
  @ApiResult({ type: Object })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number) {
    return await this.networkTemplateService.delete(+id)
  }
}
