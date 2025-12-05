import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDTO, FilterRoomDTO, UpdateRoomDto } from './dto/Room.dto';
import { Booking, Prisma, Room } from 'generated/prisma';
import { DatabaseService } from '../database/database.service';
import { PaginationQueryType } from 'src/types/util.types';
import { BookingService } from '../booking/booking.service';
import { removeFields } from '../utils/object';


/*
create room
update room
get available rooms
find all rooms with bookings
*/ 

@Injectable()
export class RoomService {
  constructor(private databasesevice: DatabaseService  ){}
  create(createRoomDto: CreateRoomDTO, user:Express.Request['user']) {
    const payload : Prisma.RoomUncheckedCreateInput = {
       ...createRoomDto,
       ownerId: Number(user?.id), 
    };

    return this.databasesevice.room.create({
        data: payload
    });
       
  }

 async findAll(user: Express.Request['user'], query: PaginationQueryType) {
    const pagination = await this.databasesevice.handleQueryPagination(query);
    return this.databasesevice.$transaction(async (prismaTX) => {
      // If user is not a GUEST, return all rooms owned by the user with bookings
      if (user?.role !== 'GUEST') {
        console.log('owner or admin');
        return prismaTX.room.findMany({
          ...removeFields(pagination, ['page']),
         // where: { ownerId: BigInt(user!.id) },
          include: { bookings: true },
        });
      }

      // For GUEST, only return AVAILABLE rooms
      return prismaTX.room.findMany({
        ...removeFields(pagination, ['page']),
        where: { status: 'AVAILABLE' },
      });
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} room`;
  // }

 async update(id: bigint, updateRoomDto: UpdateRoomDto,user:Express.Request['user']) {

       const UpdateRoom = await this.databasesevice.$transaction(async (prismaTX) =>{
            const room: Prisma.RoomUncheckedUpdateInput = {
               ...updateRoomDto
            };

            const existing = await prismaTX.room.findFirst({
              where: { 
              id: BigInt(id), 
              ownerId: BigInt(user!.id) 
                 }
             });

          if (!existing) {
            throw new NotFoundException('Not found or unauthorized');
          }

            return await prismaTX.room.update({
               where: { id:BigInt(id) },
               data: room,            
              });
     });
      return UpdateRoom;

  }

 async findAvailableRooms(filters: FilterRoomDTO) {
    const where: Prisma.RoomWhereInput = {
      status: 'AVAILABLE',
    };

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      };
    }

    // Capacity range
    if (filters.minCapacity !== undefined || filters.maxCapacity !== undefined) {
      where.capacity = {
        ...(filters.minCapacity !== undefined && { gte: filters.minCapacity }),
        ...(filters.maxCapacity !== undefined && { lte: filters.maxCapacity }),
      };
    }

    // Created date range
    if (filters.createdAtFrom || filters.createdAtTo) {
      where.createdAt = {
        ...(filters.createdAtFrom && { gte: filters.createdAtFrom }),
        ...(filters.createdAtTo && { lte: filters.createdAtTo }),
      };
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const [rooms, total] = await Promise.all([
      this.databasesevice.room.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.databasesevice.room.count({ where }),
    ]);

    console.log('Found rooms:', rooms.length);
    console.log('Total count:', total);

    // ✅ Transform BigInt to String for JSON serialization
    const serializedRooms = rooms.map(room => ({
      ...room,
      id: room.id.toString(),
      ownerId: room.ownerId.toString(),
      owner: room.owner ? {
        ...room.owner,
        id: room.owner.id.toString(),
      } : undefined,
    }));

    return {
      data: serializedRooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
}

  // remove(id: number) {
  //   return `This action removes a #${id} room`;
  // }
}
