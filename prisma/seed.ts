import { PrismaClient, Prisma } from '@prisma/client';
import { getRandomLatitude, getRandomLongitude, ALI_LAT, ALI_LON } from './../src/data/utils';

const prisma = new PrismaClient();
const users: Prisma.UserCreateInput[] = [
  {
    name: 'Ali',
    email: 'ali@baz.com',
    password: '123',
    bio: 'Dolor..',
    latitude: ALI_LAT,
    longitude: ALI_LON,
  },
  {
    name: 'Alice',
    email: 'alice@foo.com',
    password: '123',
    bio: 'Lorem!',
    latitude: getRandomLatitude(),
    longitude: getRandomLongitude(),
  },
  {
    name: 'Rick',
    email: 'rick@bar.com',
    password: '123',
    bio: 'Ipsum..',
    latitude: getRandomLatitude(),
    longitude: getRandomLongitude(),
  },
];

async function main() {
  console.log('Seeding started.');
  for (let user of users) {
    const ret = await prisma.user.create({data: user});
    console.log('Created user with id: %s', ret.id);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
    process.exit(1)
  });
