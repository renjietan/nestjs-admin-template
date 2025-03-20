import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'

import { LoggerService } from '~/shared/logger/logger.service'

import { Mission } from '../mission.decorator'

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class HttpRequestJob {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 发起请求
   * @param config {AxiosRequestConfig}
   */
  async handle(config: unknown): Promise<void> {
    if (config) {
      const result = await this.httpService.request(config)
      this.logger.log(result, HttpRequestJob.name)
    }
    else {
      throw new BadRequestException('HTTP 请求任务参数为空，请检查并补充必要参数')
    }
  }
}
