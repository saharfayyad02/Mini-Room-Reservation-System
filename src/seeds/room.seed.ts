import { Room, RoomStatus } from "../../generated/prisma";
import { faker } from "@faker-js/faker";

export const generateRoomSeed = (ownerId: bigint): Omit<Room, "id" | "createdAt" | "updatedAt"> => {
  return {
    ownerId,
    name: faker.helpers.arrayElement([
      "Deluxe Suite",
      "Ocean View Room",
      "Family Suite",
      "Standard Room",
      "Presidential Suite",
      "Honeymoon Suite",
      "Twin Bedroom",
      "Penthouse",
    ]),
    price: faker.number.float({ min: 80, max: 1200 }),
    capacity: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6]),
    status: faker.helpers.arrayElement([RoomStatus.AVAILABLE, RoomStatus.UNAVAILABLE]),
  };
};