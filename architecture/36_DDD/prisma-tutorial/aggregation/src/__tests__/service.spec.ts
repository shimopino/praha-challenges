import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostService } from '../post/service';

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

export const toCamelCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim: string, index: number) =>
      index === 0 ? leftTrim.toLowerCase() : leftTrim.toUpperCase(),
    )
    .replace(/\s+/g, '');
};

const buildPrismaInclude = (attrs: Record<string, any>) => {
  const include = Object.keys(attrs).reduce((prev, curr) => {
    const value = attrs[curr];
    const isObject = typeof value === 'object';

    const isRelation =
      isObject && Object.keys(value).find((v) => v.match(/connect|craete/));

    if (isRelation) {
      prev[curr] = true;
    }

    return prev;
  }, Object.create(null));

  const hasInclude = Object.keys(include).length;
  return hasInclude ? include : undefined;
};

const createFactory = <T>(params: {
  modelName: string;
  defaultAttrs?: Partial<T>;
}) => {
  const prisma = new PrismaClient();

  const { modelName, defaultAttrs } = params;

  const FactoryFunctions = {
    build: (attrs: Partial<T> = {}) => {
      return {
        ...defaultAttrs,
        ...attrs,
      } as T;
    },

    create: async (attrs: Partial<T> = {}) => {
      const data = FactoryFunctions.build(attrs);
      const prismaOptions: Record<string, any> = {};
      const includes = buildPrismaInclude(attrs);

      if (includes) prismaOptions.include = includes;

      const prismaModel = toCamelCase(modelName as unknown as string);

      return await prisma[prismaModel].create({
        data,
        ...prismaOptions,
      });
    },
  };

  return FactoryFunctions;
};

const client = new PrismaClient();
console.dir(client, { depth: 1 });

console.log(toCamelCase('UserModel'));
console.log(Prisma.dmmf.datamodel.models);
console.log(Prisma.dmmf.datamodel.models.map((model) => model.name));

// const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);
// // const modelNamesTypes = modelNames as const;
// // console.log(modelNames);
// type Models = typeof modelNames[number];

// createFactory<Prisma.UserCreateInput>({
//   modelName: 'Users',
// });

const userfactory = createFactory<Prisma.PostCreateInput>({
  modelName: 'Post',
  defaultAttrs: { title: '1', contents: '2' },
});
userfactory.create({ Author: { create: { name: 'user1', email: 'email1' } } });
