import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/replace-post.dto';
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

  @Put(':id')
  replacePost(@Param('id') id: string, @Body() body: UpdatePostDTO) {
    return this.postsService.replacePost(parseInt(id), body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(parseInt(id));
  }
}
