import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query ,UseInterceptors, UploadedFile} from '@nestjs/common';
import { RoomService } from './room.service';
import type { CreateRoomDTO, FilterRoomDTO, UpdateRoomDto } from './dto/Room.dto';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { FilterRoomSchema, RoomValidationSchema, UpdateRoomValidationSchema } from './util/room.validatipn';
import { Roles } from 'src/decoraters/roels.decore';
import { paginationSchema } from '../utils/api.util';
import { IdempotencyInterceptor } from '../interceptor/idempotency.interceptor';
import { FileCleanupInterceptor } from '../file/cleanup-file.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { stat } from 'fs';


@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  @Roles(["OWNER","ADMIN"])
  @UseInterceptors(FileInterceptor('file'),FileCleanupInterceptor,IdempotencyInterceptor)
  create(@Body(new ZodValidationPipe(RoomValidationSchema)) createRoomDto: CreateRoomDTO,
         @Req() req: Express.Request,
         @UploadedFile() file?: Express.Multer.File
             ) {
    return this.roomService.create(createRoomDto,req.user,file);
  }

  // delete room by admin only
  @Get('/my_rooms')
  @Roles(["OWNER"])
  async Owner_rooms(@Req() req: Express.Request,
                @Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return await this.roomService.findAll(req.user, query);
  }

  @Get('/avaliable_rooms')
  @Roles(["GUEST"])
  async avaliable_rooms(@Req() req: Express.Request,
                @Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return await this.roomService.findAll(req.user, query);
  }

  @Get('/all')
  @Roles(["ADMIN"])
  async GetAll(@Req() req: Express.Request,
                @Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return await this.roomService.findAll(req.user, query);
  }

  @Get('all/:id')
  @Roles(["ADMIN"])
  findOne(@Param('id') id: bigint) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @Roles(["OWNER","ADMIN"])
  @UseInterceptors(FileInterceptor('file'),FileCleanupInterceptor,IdempotencyInterceptor)
  update(@Param('id') id: bigint, 
         @Body(new ZodValidationPipe(UpdateRoomValidationSchema)) updateRoomDto: UpdateRoomDto,
         @Req() req: Express.Request,
         @UploadedFile() file?: Express.Multer.File) {
    return this.roomService.update(id, updateRoomDto,req.user,file);
  }

  @Get('/available')
  async findAvailableRooms(
    @Body(new ZodValidationPipe(FilterRoomSchema)) filters: FilterRoomDTO
  ) {
     console.log('Filters received:', filters);
    
    return this.roomService.findAvailableRooms(filters);
  }
}
