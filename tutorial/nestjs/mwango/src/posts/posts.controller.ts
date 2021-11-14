import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindOneParam } from '../utils/params/find-one.param';
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

  @Get(':id')
  getPostById(@Param() { id }: FindOneParam) {
    return this.postsService.getPostById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
