import { Prisma } from '@prisma/client';

export const tax_categories: Prisma.TaxCategoryCreateInput[] = [
  {
    taxCategoryName: '通常税率',
    items: {},
    taxRateRanges: {
      create: [
        {
          appliedStateDate: '1900-01-01',
          appliedEndDate: '1989-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '1989-04-01',
          appliedEndDate: '1997-03-31',
          taxRate: 1.03,
        },
        {
          appliedStateDate: '1997-04-01',
          appliedEndDate: '2014-03-31',
          taxRate: 1.05,
        },
        {
          appliedStateDate: '2014-04-01',
          appliedEndDate: '2019-09-30',
          taxRate: 1.08,
        },
        {
          appliedStateDate: '2019-10-01',
          appliedEndDate: '2099-12-31',
          taxRate: 1.1,
        },
      ],
    },
  },
  {
    taxCategoryName: '軽減税率',
    items: {},
    taxRateRanges: {
      create: [
        {
          appliedStateDate: '1900-01-01',
          appliedEndDate: '1989-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '1989-04-01',
          appliedEndDate: '1997-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '1997-04-01',
          appliedEndDate: '2014-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '2014-04-01',
          appliedEndDate: '2019-09-30',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '2019-10-01',
          appliedEndDate: '2099-12-31',
          taxRate: 1.08,
        },
      ],
    },
  },
  {
    taxCategoryName: '非課税',
    items: {},
    taxRateRanges: {
      create: [
        {
          appliedStateDate: '1900-01-01',
          appliedEndDate: '1989-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '1989-04-01',
          appliedEndDate: '1997-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '1997-04-01',
          appliedEndDate: '2014-03-31',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '2014-04-01',
          appliedEndDate: '2019-09-30',
          taxRate: 1.0,
        },
        {
          appliedStateDate: '2019-10-01',
          appliedEndDate: '2099-12-31',
          taxRate: 1.0,
        },
      ],
    },
  },
];
