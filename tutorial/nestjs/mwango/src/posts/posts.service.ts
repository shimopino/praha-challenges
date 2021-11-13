import { Injectable } from '@nestjs/common';
import { Post } from './post.interface';

@Injectable()
export class PostsService {
  // 記事のデータはインメモリに保存する
  private posts: Post[] = [];

  getAllPosts() {
    return this.posts;
  }
}
