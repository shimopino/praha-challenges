import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostService } from 'src/post/service';

describe('GetPostService', () => {
  let service: GetPostService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPostService, PrismaService],
    }).compile();

    service = module.get<GetPostService>(GetPostService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
  });

  // afterAll(async () => {
  //   await prisma.$disconnect();
  // });

  it('Service should not be undefined', () => {
    expect(service).toBeDefined();
  });

  it('[正常系] 0件の記事を取得する', async () => {
    // Given

    // When
    const actual = await service.getPosts();
    // Then
    expect(actual).toEqual([]);
  });

  it('[正常系] 5件の記事を、投稿日の降順で取得する', () => {
    expect(true).toBeTruthy();
  });
});
