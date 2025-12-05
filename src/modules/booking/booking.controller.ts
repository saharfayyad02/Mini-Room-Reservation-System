import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import type { CreateBookingDto, updatedBookingDto } from './dto/create-booking.dto';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { CreateBookingSchema } from './util/booking.validation.schema';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  create(@Body(new ZodValidationPipe(CreateBookingSchema)) createBookingDto: CreateBookingDto,
         @Req() req:Express.Request) {
    return this.bookingService.create(createBookingDto, BigInt(req.user!.id));
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }


 @Patch(':id')
 async update(@Param('id') id: bigint, @Req() req: Express.Request) {
  return this.bookingService.update(BigInt(req.user!.id), BigInt(id));
 }

}
