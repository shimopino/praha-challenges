import { Controller, Get } from '@nestjs/common';
import { GetPostService } from './service';

@Controller('post')
export class PostController {
  constructor(private getPostService: GetPostService) {}

  @Get()
  getPosts() {}
}
