import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/replace-post.dto';
import { Post } from './post.interface';

@Injectable()
export class PostsService {
  private lastPostId = 0;
  // 記事のデータはインメモリに保存する
  private posts: Post[] = [];

  getAllPosts() {
    return this.posts;
  }

  getPostById(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  createPost(post: CreatePostDTO) {
    const newPost = {
      id: this.posts.length + 1,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }

  replacePost(id: number, post: UpdatePostDTO) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    const newPost = { id, ...post };
    this.posts[postIndex] = newPost;
    return newPost;
  }

  deletePost(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    this.posts.splice(postIndex, 1);
    return id;
  }
}
