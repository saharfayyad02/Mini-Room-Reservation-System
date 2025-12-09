import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import type { CreateBookingDto, updatedBookingDto } from './dto/create-booking.dto';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { CreateBookingSchema } from './util/booking.validation.schema';
import { IdempotencyInterceptor } from '../interceptor/idempotency.interceptor';
import { Roles } from 'src/decoraters/roels.decore';
import { paginationSchema } from '../utils/api.util';


@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  @UseInterceptors(IdempotencyInterceptor)
  async create(@Body(new ZodValidationPipe(CreateBookingSchema)) createBookingDto: CreateBookingDto,
         @Req() req:Express.Request) {
    return await this.bookingService.create(createBookingDto, BigInt(req.user!.id));
  }

  @Patch(':id')
  @UseInterceptors(IdempotencyInterceptor)
 async update(@Param('id') id: bigint, @Req() req: Express.Request) {
  return this.bookingService.update(BigInt(req.user!.id), BigInt(id));
 }


  @Get('/my_bookings')
  @Roles(['GUEST'])
  my_bookings(@Req() req: Express.Request,
                  @Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return this.bookingService.my_bookings(req.user,query);
  }

  @Get()
  @Roles(['ADMIN','OWNER'])
  findAll(@Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return this.bookingService.findAll(query);
  }

  @Get(':id')
  @Roles(['ADMIN','OWNER'])
  findOne(@Param('id') id: bigint) {
    return this.bookingService.findOne(id);
  }
}
