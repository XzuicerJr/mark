import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "zuicerjr@gmail.com" },
    update: {},
    create: {
      email: "zuicerjr@gmail.com",
      name: "Zuicer Jr",
      habits: {
        createMany: {
          data: [
            {
              name: "Read",
              description: "Read 10 pages of a book",
              startDate: new Date(),
              icon: "BookOpen",
              color: "blue",
            },
            {
              name: "Write",
              description: "Write 100 words",
              startDate: new Date(),
              icon: "Pen",
              color: "blue",
            },
            {
              name: "Exercise",
              description: "Exercise for 30 minutes",
              startDate: new Date(),
              icon: "Dumbbell",
              color: "blue",
            },
          ],
        },
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
