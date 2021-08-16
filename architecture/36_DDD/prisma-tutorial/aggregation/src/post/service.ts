import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostListDTO } from './dto/get-posts-dto';

@Injectable()
export class GetPostService {
  constructor(private prisma: PrismaService) {}

  async getPosts(): Promise<GetPostListDTO[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        reviews: true,
      },
      orderBy: {
        published: 'desc',
      },
    });

    const results = [];
    for (const post of posts) {
      const reviewScore =
        post.reviews.reduce((sum, review) => sum + review.rating, 0) /
        post.reviews.length;

      const result = new GetPostListDTO({
        postId: post.id,
        postTitle: post.title,
        postContents: post.contents,
        authorId: post.authorId,
        review: reviewScore,
      });

      results.push(result);
    }

    return results;
  }
}
