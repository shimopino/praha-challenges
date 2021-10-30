import { Module } from '@nestjs/common';
import { DiscService } from './disc.service';

@Module({
  providers: [DiscService]
})
export class DiscModule {}
