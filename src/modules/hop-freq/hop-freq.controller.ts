import { Controller } from '@nestjs/common';
import { HopFreqService } from './hop-freq.service';

@Controller('hop-freq')
export class HopFreqController {
  constructor(private readonly hopFreqService: HopFreqService) {}
}
