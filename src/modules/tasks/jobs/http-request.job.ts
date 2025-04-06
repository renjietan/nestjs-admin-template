import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'

import { LoggerService } from '~/shared/logger/logger.service'

import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'types/i18n.generated'
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
    private readonly i18n: I18nService<I18nTranslations>
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
      throw new BadRequestException(this.i18n.t("index.Task.HttpRequestTaskParametersMissing"))
    }
  }
}
