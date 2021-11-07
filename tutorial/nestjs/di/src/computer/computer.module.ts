import { Module } from '@nestjs/common';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiscModule } from 'src/disc/disc.module';
import { ComputerController } from './computer.controller';

@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiscModule],
})
export class ComputerModule {}
