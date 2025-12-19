import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
function getDefaultAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@nurtw.local";
  const name = process.env.DEFAULT_ADMIN_NAME ?? "Admin";
  let password = process.env.DEFAULT_ADMIN_PASSWORD ?? "";
  if (!password) {
    // Generate a one-time random password for dev convenience.
    password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    console.warn(
      `[seed] DEFAULT_ADMIN_PASSWORD was not set. Generated dev password for ${email}: ${password}`
    );
  }
  return { email, name, password };
}

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL })

async function main() {
  const defaultAdmin = getDefaultAdmin();
  // Create default admin user
  const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: defaultAdmin.email },
    update: {},
    create: {
      email: defaultAdmin.email,
      password: hashedPassword,
      name: defaultAdmin.name,
    },
  })

  // Create sample parks
  const parks = await Promise.all([
    prisma.park.upsert({
      where: { code: 'LG001' },
      update: {},
      create: {
        name: 'Lagos Central Park',
        code: 'LG001',
        defaultOrigin: 'Lagos',
      },
    }),
    prisma.park.upsert({
      where: { code: 'AB002' },
      update: {},
      create: {
        name: 'Abuja Transport Hub',
        code: 'AB002',
        defaultOrigin: 'Abuja',
      },
    }),
    prisma.park.upsert({
      where: { code: 'KN003' },
      update: {},
      create: {
        name: 'Kano Motor Park',
        code: 'KN003',
        defaultOrigin: 'Kano',
      },
    }),
  ])

  // Create sample agents
  const agents = await Promise.all([
    prisma.agent.upsert({
      where: { code: '1001' },
      update: {},
      create: {
        name: 'Ahmed Bello',
        code: '1001',
        parkId: parks[0].id,
      },
    }),
    prisma.agent.upsert({
      where: { code: '2002' },
      update: {},
      create: {
        name: 'Chioma Okafor',
        code: '2002',
        parkId: parks[1].id,
      },
    }),
    prisma.agent.upsert({
      where: { code: '3003' },
      update: {},
      create: {
        name: 'Musa Ibrahim',
        code: '3003',
        parkId: parks[2].id,
      },
    }),
  ])

  // Create sample manifest
  const manifest = await prisma.manifest.create({
    data: {
      manifestCode: 'NURTW-LAGOS-ABUJA-LG001-' + Date.now(),
      origin: 'Lagos',
      destination: 'Abuja',
      plateNumber: 'ABC-123-XYZ',
      driverName: 'John Doe',
      driverPhone: '08012345678',
      capacity: 14,
      agentId: agents[0].id,
      parkId: parks[0].id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Admin user:', admin.email)
  console.log('Sample parks:', parks.length)
  console.log('Sample agents:', agents.length)
  console.log('Sample manifest:', manifest.manifestCode)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })