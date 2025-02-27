import { Body, Controller, Ip, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Uri } from '~/common/decorators/http.decorator'
import { AllowAnon } from '../../common/decorators/auth/allow-anon.decorator'
import { definePermission, Perm } from '../../common/decorators/auth/permission.decorator'
import { Public } from '../../common/decorators/auth/public.decorator'
import { TestCreateDto } from './dto/create.dto'
import { TestService } from './test.service'

export const permissions = definePermission('netdisk:manage', {
  LIST: 'list',
  CREATE: 'create',
  INFO: 'info',
  UPDATE: 'update',
  DELETE: 'delete',
  MKDIR: 'mkdir',
  TOKEN: 'token',
  MARK: 'mark',
  DOWNLOAD: 'download',
  RENAME: 'rename',
  CUT: 'cut',
  COPY: 'copy',
} as const)

@ApiTags('Mock - 测试')
@Controller('test')
@Public()
export class TestController {
  constructor(private readonly testService: TestService) {

  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  @Perm(permissions.LIST)
  create(@Body() data: TestCreateDto, @Ip() ip: string, @Uri() uri) {
    console.log('data=============', data)
    console.log('ip============', ip)
    console.log('uri============', uri)
    // throw new CannotFindException()
    // throw new SocketException("socket============")
    // throw new BusinessException(
    //   ErrorEnum.ILLEGAL_OPERATION_DIRECTORY_PARENT,
    // )
  }

  @ApiOperation({
    summary: '编辑',
  })
  @Post(':id')
  @AllowAnon()
  update() {
    console.log('111111111111')
  }
}
