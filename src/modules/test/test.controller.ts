import { Body, Controller, Ip, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Uri } from '~/common/decorators/http.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { TestCreateDto } from './dto/create.dto'
import { TestService } from './test.service'

@ApiTags('System - 测试')
@Controller('test')
@ApiSecurityAuth()
export class TestController {
  constructor(private readonly testService: TestService) {

  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
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
}
