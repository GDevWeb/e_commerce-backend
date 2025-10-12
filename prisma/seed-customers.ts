import { config } from "dotenv";
import { Prisma, PrismaClient } from "../src/generated/prisma";

config();

const prisma = new PrismaClient();

const customerData: Prisma.CustomerCreateInput[] = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    date_of_birth: new Date("1990-01-15T00:00:00.000Z"),
    customer_type: "GOLD",
    preferred_contact_method: "EMAIL",
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone_number: "098-765-4321",
    address: "456 Oak Ave, Somewhere, USA",
    date_of_birth: new Date("1985-05-20T00:00:00.000Z"),
    customer_type: "PLATINUM",
    preferred_contact_method: "PHONE",
  },
  {
    first_name: "Peter",
    last_name: "Jones",
    email: "peter.jones@example.com",
    phone_number: "111-222-3333",
    address: "789 Pine Ln, Nowhere, USA",
    date_of_birth: new Date("1992-03-01T00:00:00.000Z"),
    customer_type: "STANDARD",
    preferred_contact_method: "SMS",
  },
];

async function main() {
  console.info("Start seeding customer table ...");

  await Promise.all(
    customerData.map(async (customer) => {
      return prisma.customer.upsert({
        where: { email: customer.email },
        update: {},
        create: customer,
      });
    })
  );

  console.info("Customers seeded.");
  console.info("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
