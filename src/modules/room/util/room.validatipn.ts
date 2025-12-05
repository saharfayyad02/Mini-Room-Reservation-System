import { Room } from "generated/prisma";
import z, { ZodType } from "zod";
import { CreateRoomDTO, FilterRoomDTO } from "../dto/Room.dto";
import { paginationSchema } from "src/modules/utils/api.util";
import { PaginationQueryType } from "src/types/util.types";

export const RoomValidationSchema = z.object({
    name: z.string().min(1).max(50),
    capacity: z.number().min(1).max(500),
    status: z.enum(["AVAILABLE","UNAVAILABLE"]),
    price: z.number().min(0),
}) satisfies ZodType<CreateRoomDTO>;

export const UpdateRoomValidationSchema = RoomValidationSchema.partial() satisfies ZodType<Partial<CreateRoomDTO>>;

export const RoomSchema =  paginationSchema.extend({
    name: z.string().min(1).max(50).optional(),
})satisfies ZodType<PaginationQueryType>


export const FilterRoomSchema = z.object({
  // Date range
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  
  // Price range
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  
  // Capacity range
  minCapacity: z.coerce.number().int().min(1).optional(),
  maxCapacity: z.coerce.number().int().min(1).optional(),

    page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})satisfies ZodType<FilterRoomDTO>;
