import { Booking } from "generated/prisma";

export type CreateBookingDto = Pick<Booking , 'checkIn'|'checkOut' > & {roomId: number};

export type updatedBookingDto = Pick<Booking,'status'>;

