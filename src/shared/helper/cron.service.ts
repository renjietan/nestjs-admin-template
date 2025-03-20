import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CronExpression } from '@nestjs/schedule'
import dayjs from 'dayjs'

import { LessThan } from 'typeorm'

import { CronOnce } from '~/common/decorators/cron-once.decorator'
import { ConfigKeyPaths } from '~/config'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AccessTokenEntity } from '~/entities/access-token.entity'

@Injectable()
export class CronService {
  private logger: Logger = new Logger(CronService.name)
  constructor(
    private readonly configService: ConfigService<ConfigKeyPaths>,
  ) {}

  @CronOnce(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredJWT() {
    this.logger.log(`--> ${ ErrorEnum.StartScanningClearExpired } token`)

    const expiredTokens = await AccessTokenEntity.find({
      where: {
        expired_at: LessThan(new Date()),
      },
    })

    let deleteCount = 0
    await Promise.all(
      expiredTokens.map(async (token) => {
        const { value, created_at } = token

        await AccessTokenEntity.remove(token)

        this.logger.debug(
          `--> ${ ErrorEnum.DeleteExpired } token：${value}, ${ ErrorEnum.IssuedAt } ${dayjs(created_at).format(
            'YYYY-MM-DD H:mm:ss',
          )}`,
        )

        deleteCount += 1
      }),
    )

    this.logger.log(`--> ${ ErrorEnum.Deleted } ${deleteCount} ${ ErrorEnum.ExpiredItemsCleared } token`)
  }
}
