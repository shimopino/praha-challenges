import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { UserService } from './user.sservice';
import { Post as PostModel } from '@prisma/client';

@Controller()
export class SampleController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }
}
