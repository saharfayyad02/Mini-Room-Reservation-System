import { Booking, BookingStatus } from "../../generated/prisma";
import { faker } from "@faker-js/faker";

export const generateBookingSeed = (
  guestId: bigint,
  roomId: bigint
): Omit<Booking, "id" | "createdAt" | "updatedAt"> => {
  const checkIn = faker.date.between({
    from: new Date(),
    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // next 3 months
  });

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + faker.number.int({ min: 1, max: 14 }));

  return {
    guestId,
    roomId,
    checkIn,
    checkOut,
    status: faker.helpers.arrayElement([
      BookingStatus.CONFIRMED,
      BookingStatus.PENDING,
      BookingStatus.CANCELLED,
    ]),
  };
};