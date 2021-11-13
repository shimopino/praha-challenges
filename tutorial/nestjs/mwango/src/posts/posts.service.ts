import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dtos/create-post.dto';
import { Post } from './post.interface';

@Injectable()
export class PostsService {
  private lastPostId = 0;
  // 記事のデータはインメモリに保存する
  private posts: Post[] = [];

  getAllPosts() {
    return this.posts;
  }

  createPost(post: CreatePostDTO) {
    const newPost = {
      id: this.posts.length + 1,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }
}
