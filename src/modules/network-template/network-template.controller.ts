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

@ApiTags('网络模板')
@Controller('network-template')
export class NetworkTemplateController {
  constructor(
    private readonly networkTemplateService: NetworkTemplateService,
  ) { }

  @ApiOperation({
    summary: '新增 文件 或 模板',
  })
  @Post()
  async create(@Query() data: NetWorkTemplateDTO, @AuthUser() user:IAuthUser) {
    return await this.networkTemplateService.create(user?.uid, data)
  }

  @ApiOperation({
    summary: '更新: 参数说明 查看下方 UpdateNetWorkTemplateDTO, 不需要更新的字段，不传',
  })
  @Put('update/:id')
  async update(@IdParam() id: string, @Body() data: UpdateNetWorkTemplateDTO) {
    return await this.networkTemplateService.update(+id, data)
  }

  @ApiOperation({
    summary: '列表: 根据名称搜索, 不传查所有',
  })
  @Get()
  async findBy(@Query() data: SearchNetWorkTemplateDto) {
    const res = await this.networkTemplateService.findBy(data)
    let res_arr = instanceToPlain(res)
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
  async delete(@IdParam() id: number) {
    return await this.networkTemplateService.delete(+id)
  }
}
