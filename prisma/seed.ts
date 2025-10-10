import { Prisma, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const brandData: Prisma.BrandCreateInput[] = [
  { name: "Logitech" },
  { name: "Apple" },
  { name: "Dell" },
  { name: "Samsung" },
  { name: "Microsoft" },
];

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: "Laptops" },
  { name: "Keyboards" },
  { name: "Monitors" },
  { name: "Accessories" },
];

async function main() {
  console.log("Start seeding...");

  // Seed Brands
  await Promise.all(
    brandData.map(async (brand) => {
      return prisma.brand.upsert({
        where: { name: brand.name },
        update: {},
        create: brand,
      });
    })
  );
  console.log("Brands seeded.");

  // Seed Categories
  await Promise.all(
    categoryData.map(async (category) => {
      return prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    })
  );
  console.log("Categories seeded.");

  // Seed Products - Requires existing brands and categories
  const logitech = await prisma.brand.findUnique({
    where: { name: "Logitech" },
  });
  const apple = await prisma.brand.findUnique({ where: { name: "Apple" } });
  const dell = await prisma.brand.findUnique({ where: { name: "Dell" } });
  const samsung = await prisma.brand.findUnique({ where: { name: "Samsung" } });

  const keyboards = await prisma.category.findUnique({
    where: { name: "Keyboards" },
  });
  const laptops = await prisma.category.findUnique({
    where: { name: "Laptops" },
  });
  const monitors = await prisma.category.findUnique({
    where: { name: "Monitors" },
  });

  if (
    !logitech ||
    !apple ||
    !dell ||
    !samsung ||
    !keyboards ||
    !laptops ||
    !monitors
  ) {
    console.error("Missing brands or categories. Aborting product seed.");
    return;
  }

  const productData: Prisma.ProductCreateInput[] = [
    {
      name: "Logitech G Pro Keyboard",
      price: 129.99,
      stock_quantity: 50,
      brand: { connect: { id: logitech.id } },
      category: { connect: { id: keyboards.id } },
      sku: "LOGIGPROKEY001",
    },
    {
      name: "Apple MacBook Pro M3",
      price: 2499.0,
      stock_quantity: 20,
      brand: { connect: { id: apple.id } },
      category: { connect: { id: laptops.id } },
      sku: "APPLEMBOOKM3001",
    },
    {
      name: "Dell XPS 15",
      price: 1899.0,
      stock_quantity: 15,
      brand: { connect: { id: dell.id } },
      category: { connect: { id: laptops.id } },
      sku: "DELXPS15001",
    },
    {
      name: "Samsung 4K Monitor",
      price: 599.99,
      stock_quantity: 30,
      brand: { connect: { id: samsung.id } },
      category: { connect: { id: monitors.id } },
      sku: "SAM4KMON001",
    },
  ];

  await Promise.all(
    productData.map(async (product) => {
      // Create products, assumes no existing products with the same name.
      return prisma.product.create({ data: product });
    })
  );
  console.log("Products seeded.");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
