import { PrismaClient, Role } from "../../generated/prisma";
import { faker } from "@faker-js/faker";
import { generateUserSeed, createAdminUser } from "./user.seed";
import { generateRoomSeed } from "./room.seed";
import { generateBookingSeed } from "./booking.seed";
import * as argon from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ----------------------------------------------------
  // Delete old data (order matters due to FK constraints)
  // ----------------------------------------------------
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();
  console.log("✔️ Cleared old data");

  // ----------------------------------------------------
  // 1️⃣ Create Admin
  // ----------------------------------------------------
  const admin = await createAdminUser();
  const createdAdmin = await prisma.user.create({ data: admin });

  console.log(`✔️ Admin created: ${createdAdmin.email}`);

  // ----------------------------------------------------
  // 2️⃣ Create Owners (e.g. 5)
  // ----------------------------------------------------
  const ownerSeeds = [];
  for (let i = 0; i < 5; i++) {
    const user = generateUserSeed();
    user.role = Role.OWNER;
    user.password = await argon.hash("Owner@123!");
    ownerSeeds.push(user);
  }

  const createdOwners = await Promise.all(
    ownerSeeds.map((data) => prisma.user.create({ data }))
  );

  console.log(`✔️ Owners created: ${createdOwners.length}`);

  // ----------------------------------------------------
  // 3️⃣ Create Guests (e.g. 15)
  // ----------------------------------------------------
  const guestSeeds = [];
  for (let i = 0; i < 15; i++) {
    const user = generateUserSeed();
    user.role = Role.GUEST;
    user.password = await argon.hash("Guest@123!");
    guestSeeds.push(user);
  }

  const createdGuests = await Promise.all(
    guestSeeds.map((data) => prisma.user.create({ data }))
  );

  console.log(`✔️ Guests created: ${createdGuests.length}`);

  // ----------------------------------------------------
  // 4️⃣ Create Rooms for Each Owner
  // 3 rooms per owner
  // ----------------------------------------------------
  const allRooms = [];

  for (const owner of createdOwners) {
    const roomSeeds = faker.helpers.multiple(
      () => generateRoomSeed(owner.id),
      { count: 3 }
    );

    const rooms = await Promise.all(
      roomSeeds.map((data) => prisma.room.create({ data }))
    );

    allRooms.push(...rooms);
  }

  console.log(`✔️ Rooms created: ${allRooms.length}`);

  // ----------------------------------------------------
  // 5️⃣ Create Bookings
  // 20 random bookings linking guests & rooms
  // ----------------------------------------------------
  for (let i = 0; i < 20; i++) {
    const guest = faker.helpers.arrayElement(createdGuests);
    const room = faker.helpers.arrayElement(allRooms);

    await prisma.booking.create({
      data: generateBookingSeed(guest.id, room.id),
    });
  }

  console.log("✔️ Bookings created: 20");

  // ----------------------------------------------------
  // Done
  // ----------------------------------------------------
  await prisma.$disconnect();
  console.log("🌱 Seed completed successfully!");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
