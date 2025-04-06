import { BadRequestException, Injectable } from '@nestjs/common'

import { LoggerService } from '~/shared/logger/logger.service'
import { MailerService } from '~/shared/mailer/mailer.service'

import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'types/i18n.generated'
import { Mission } from '../mission.decorator'

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class EmailJob {
  constructor(
    private readonly emailService: MailerService,
    private readonly logger: LoggerService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  async send(config: any): Promise<void> {
    if (config) {
      const { to, subject, content } = config
      const result = await this.emailService.send(to, subject, content)
      this.logger.log(result, EmailJob.name)
    }
    else {
      throw new BadRequestException(this.i18n.t("index.Email.EmailTaskParametersMissing"))
    }
  }
}
