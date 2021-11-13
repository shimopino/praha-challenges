import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/replace-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPosts() {
    return await this.prisma.post.findMany();
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPost(post: CreatePostDTO) {
    const newPost = await this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
      },
    });

    return newPost;
  }

  async replacePost(id: number, post: UpdatePostDTO) {
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title: post.title,
        content: post.content,
      },
    });

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  async deletePost(id: number) {
    const deletePost = await this.prisma.post.delete({
      where: { id },
    });

    if (!deletePost) {
      throw new NotFoundException('Post not found');
    }

    return deletePost.id;
  }
}
