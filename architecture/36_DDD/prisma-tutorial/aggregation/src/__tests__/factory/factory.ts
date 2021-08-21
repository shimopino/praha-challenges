import { PrismaClient } from '@prisma/client';

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
