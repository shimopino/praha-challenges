import { Module } from '@nestjs/common';
import { PostModule } from './post/module';

@Module({
  imports: [PostModule],
})
export class AppModule {}
