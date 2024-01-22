import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const createUser = () => {
  return {
    clerkId: faker.string.uuid(),
    name: faker.internet.userName(),
    image: faker.internet.avatar(),
  };
};

async function main() {
  const users = faker.helpers.multiple(createUser, {
    count: 50,
  });

  await prisma.user.createMany({
    data: users,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
