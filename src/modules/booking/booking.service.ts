import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateBookingDto, updatedBookingDto } from './dto/create-booking.dto';
import { DatabaseService } from '../database/database.service';
import { Roles } from 'src/decoraters/roels.decore';
import { UpdateRoomDto } from '../room/dto/Room.dto';


/**
 * create booking
 * get avaliable booking by check in and check out
 * cancel booking
 * get available booking by check capacity and price
 */

@Injectable()
export class BookingService {
  constructor(private databaseService : DatabaseService){}
  // @Roles(["GUEST","ADMIN","OWNER"])
  async create(createBookingDto: CreateBookingDto,userId: number | bigint) {

  const { roomId, checkIn, checkOut } = createBookingDto;

   const booking = await this.databaseService.$transaction(async (prismaTx) => {
    const room = await prismaTx.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== 'AVAILABLE') {
      throw new BadRequestException('Room is not available');
    }

    // 2. Check for conflicting ACTIVE bookings only (exclude CANCELLED)
    const existingBooking = await prismaTx.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['PENDING', 'CONFIRMED'] }, 
        // Overlap rule
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'Room is not available during the selected dates'
      );
    }

    // 3. Create the booking
    const newBooking = await prismaTx.booking.create({
      data: {
        checkIn,
        checkOut,
        status: 'CONFIRMED',
        guestId: BigInt(userId),
        roomId: room.id,
      },
    });

    await prismaTx.room.update({
      where: { id: room.id },
      data: { status: 'UNAVAILABLE'},
    });

    return newBooking;
  });

  return booking;
  }

 async update(guestId: bigint, bookingId: bigint) {
  console.log('Starting cancellation:', { guestId, bookingId });
  
  const result = await this.databaseService.$transaction(async (prismaTx) => {
    // 1. Find booking
    const booking = await prismaTx.booking.findFirst({
      where: {
        id: bookingId,
        guestId: guestId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or does not belong to this user');
    }

    console.log('Found booking:', booking);

    // 2. Mark the room as AVAILABLE
    const updatedRoom = await prismaTx.room.update({
      where: { id: booking.roomId },
      data: { status: 'AVAILABLE' },
    });

    console.log('Updated room:', updatedRoom);

    // 3. Cancel the booking
    const cancelledBooking = await prismaTx.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    console.log('Cancelled booking:', cancelledBooking);

    return cancelledBooking;
  });

  console.log('Transaction completed successfully');
  
  // Verify the room status after transaction
  const verifyRoom = await this.databaseService.room.findUnique({
    where: { id: result.roomId }
  });
  console.log('Room status after transaction:', verifyRoom?.status);
  
  return result;
}

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

 

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
