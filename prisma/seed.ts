import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dan = await prisma.user.upsert({
    where: { email: "danrom@music-app.com" },
    update: {},
    create: {
      email: "danrom@music-app.com",
      password: "passw123",
      post: {
        create: [
          {
            fileKey: "1695623948279-Paint The Town Red.mp3",
            imageKey: "1695623948323-Paint The Town Red.jpg",
            name: "Paint The Town Red",
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@music-app.com" },
    update: {},
    create: {
      email: "bob@music-app.com",
      password: "bobw123",
      post: {
        create: [
          {
            fileKey: "1695623785581-God's Plan.mp3",
            imageKey: "1695623785667-God's Plan.jpg",
            name: "God's Plan",
          },
        ],
      },
    },
  });

  const tom = await prisma.user.upsert({
    where: { email: "tom_mate@music-app.com" },
    update: {},
    create: {
      email: "tom_mate@music-app.com",
      password: "tompasww123",
      post: {
        create: [
          {
            fileKey: "1695624179659-HARDY BOYS 3.mp3",
            imageKey: "1695624179696-HARDY BOYS 3.jpg",
            name: "HARDY BOYS 3",
          },
        ],
      },
    },
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
