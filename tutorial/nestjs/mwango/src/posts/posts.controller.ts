import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Post()
  createPost(@Body() body: CreatePostDTO) {
    return this.postsService.createPost(body);
  }
}
