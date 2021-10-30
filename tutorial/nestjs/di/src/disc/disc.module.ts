import { Module } from '@nestjs/common';
import { PowerModule } from 'src/power/power.module';
import { DiscService } from './disc.service';

@Module({
  providers: [DiscService],
  imports: [PowerModule],
  exports: [DiscService],
})
export class DiscModule {}
