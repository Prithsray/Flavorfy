// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'prithsray@gmail.com'; // Fixed the email typo
  const password = 'Admin@2512';
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if an admin user already exists to prevent duplicates
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Prithwish',
      },
    });
    console.log('Initial admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
