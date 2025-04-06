import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

import { isEmpty } from 'lodash'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'types/i18n.generated'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { genCaptchaImgKey } from '~/helper/genRedisKey'
import { CaptchaLogService } from '~/modules/system/log/services/captcha-log.service'

@Injectable()
export class CaptchaService {
  constructor(
    @InjectRedis() private redis: Redis,

    private captchaLogService: CaptchaLogService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  /**
   * 校验图片验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redis.get(genCaptchaImgKey(id))
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase())
      throw new BusinessException(this.i18n.t("index.Login.INVALID_VERIFICATION_CODE"))

    // 校验成功后移除验证码
    await this.redis.del(genCaptchaImgKey(id))
  }

  async log(
    account: string,
    code: string,
    provider: 'sms' | 'email',
    uid?: number,
  ): Promise<void> {
    await this.captchaLogService.create(account, code, provider, uid)
  }
}
