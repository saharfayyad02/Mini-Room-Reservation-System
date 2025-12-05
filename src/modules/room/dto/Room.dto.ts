import { Room } from "generated/prisma";

export type CreateRoomDTO = Omit<Room , 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>


export type UpdateRoomDto = Pick<Room , 'name' | 'price' | 'status' | 'capacity'>

export type FilterRoomDTO = {
   createdAtFrom?: Date;
  createdAtTo?: Date;
  
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Capacity range
  minCapacity?: number;
  maxCapacity?: number;

  page: number;
  limit: number;
}