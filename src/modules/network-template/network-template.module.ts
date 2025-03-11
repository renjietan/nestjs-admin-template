import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkTemplateController } from './network-template.controller'
import { NetworkTemplateService } from './network-template.service'
import { NNetWorkTemplateEntity } from '~/entities/n_network_template'
import { DictItemModule } from '../system/dict-item/dict-item.module'

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      NNetWorkTemplateEntity,
    ]),
  ],
  controllers: [NetworkTemplateController],
  providers: [NetworkTemplateService],
})
export class NetworkTemplateModule {}
