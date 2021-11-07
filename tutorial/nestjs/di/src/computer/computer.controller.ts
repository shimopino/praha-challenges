import { Controller, Get } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiscService } from 'src/disc/disc.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private discService: DiscService,
  ) {}

  @Get()
  run() {
    return [this.cpuService.compute(1, 2), this.discService.getData()];
  }
}
