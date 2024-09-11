import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser() {
  const newUser = await prisma.user.create({
    data: {
      name: 'Elliott',
      email: 'xelliottx@example-user.com',
    },
  });
}

async function selectAll() {
    const users = await prisma.user.findMany();
    console.log('users', users)
}

selectAll()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })