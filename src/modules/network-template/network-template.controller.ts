import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { instanceToPlain } from 'class-transformer'
import { UpdateResult } from 'typeorm'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { NNetWorkTemplateEntity } from '~/entities/n_network_template'
import { createPaginationObject } from '~/helper/paginate/create-pagination'
import { parseArrayToTree } from '~/utils'
import { NetWorkTemplateDTO } from './dto/NetWorkTemplateDTO'
import { SearchNetWorkTemplateDto } from './dto/search.dto'
import { UpdateNetWorkTemplateDTO } from './dto/update.dto'
import { NetworkTemplateService } from './network-template.service'


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
    summary: '列表'
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
    return createPaginationObject({
      items: _res,
      totalItems: _res.length,
      currentPage: 1,
      limit: _res.length
    })
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  @ApiResult({ type: NNetWorkTemplateEntity })
  @Perm(permissions.CREATE)
  async create(@Query() data: NetWorkTemplateDTO, @AuthUser() user:IAuthUser) {
    return await this.networkTemplateService.create(user?.uid, data)
  }

  @ApiOperation({
    summary: '更新',
    description: '参数说明 查看下方 UpdateNetWorkTemplateDTO, 不需要更新的字段，不传'
  })
  @Put('update/:id')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: string, @Body() data: UpdateNetWorkTemplateDTO, @AuthUser() user:IAuthUser) {
    return await this.networkTemplateService.update(+id, data, user?.uid)
  }

  @ApiOperation({
    summary: '删除',
  })
  @Delete('delete/:id')
  @ApiResult({ type: Object })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number) {
    return await this.networkTemplateService.delete(+id)
  }
}
