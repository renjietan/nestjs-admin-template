import { Module } from '@nestjs/common';
import { PShotMessageService } from './p_shot_message.service';
import { PShotMessageController } from './p_shot_message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PShotMessageEntity } from '~/entities/p_shot_message';

@Module({
  imports: [
    TypeOrmModule.forFeature([PShotMessageEntity]),
  ],
  controllers: [PShotMessageController],
  providers: [PShotMessageService],
})
export class PShotMessageModule {}
