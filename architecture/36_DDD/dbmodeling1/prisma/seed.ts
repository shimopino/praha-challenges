import { PrismaClient } from '@prisma/client';
import { tax_categories } from './seed-tax-data';

const prisma = new PrismaClient();

async function main() {
  for (const tax_category of tax_categories) {
    const result = await prisma.taxCategory.create({
      data: tax_category,
    });

    console.log(`seeding ${result.id} : ${result.taxCategoryName}`);
  }

  console.log('seeding succeed ...');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
