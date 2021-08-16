import { Module } from '@nestjs/common';
import { PostController } from './controller';
import { GetPostService } from './service';

@Module({
  controllers: [PostController],
  providers: [GetPostService],
})
export class PostModule {}
