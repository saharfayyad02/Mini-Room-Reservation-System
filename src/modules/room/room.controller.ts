import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query ,UseInterceptors} from '@nestjs/common';
import { RoomService } from './room.service';
import type { CreateRoomDTO, FilterRoomDTO, UpdateRoomDto } from './dto/Room.dto';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { FilterRoomSchema, RoomValidationSchema, UpdateRoomValidationSchema } from './util/room.validatipn';
import { Roles } from 'src/decoraters/roels.decore';
import { paginationSchema } from '../utils/api.util';
import { IdempotencyInterceptor } from '../interceptor/idempotency.interceptor';


@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  @Roles(["OWNER","ADMIN"])
  @UseInterceptors(IdempotencyInterceptor)
  create(@Body(new ZodValidationPipe(RoomValidationSchema)) createRoomDto: CreateRoomDTO,
         @Req() req: Express.Request,
             ) {
    return this.roomService.create(createRoomDto,req.user);
  }

  // get avaliable rooms if the customer role is guest
  // get all rooms with booking if the role is owner or admin
  @Get()
  @Roles(["OWNER","ADMIN","GUEST"])
  async findAll(@Req() req: Express.Request,
                @Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return await this.roomService.findAll(req.user, query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomService.findOne(+id);
  // }

  @Patch(':id')
  @Roles(["OWNER","ADMIN"])
  @UseInterceptors(IdempotencyInterceptor)
  update(@Param('id') id: bigint, 
         @Body(new ZodValidationPipe(UpdateRoomValidationSchema)) updateRoomDto: UpdateRoomDto,
         @Req() req: Express.Request) {
    return this.roomService.update(id, updateRoomDto,req.user);
  }

  @Get('/available')
  async findAvailableRooms(
    @Body(new ZodValidationPipe(FilterRoomSchema)) filters: FilterRoomDTO
  ) {
     console.log('Filters received:', filters);
    
    return this.roomService.findAvailableRooms(filters);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomService.remove(+id);
  // }
}
