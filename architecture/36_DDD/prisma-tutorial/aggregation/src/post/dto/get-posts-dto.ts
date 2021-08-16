export class GetPostListDTO {
  constructor(
    private params: {
      postId: number;
      postTitle: string;
      postContents: string;
      authorId: number;
      review: number;
    },
  ) {}
}
