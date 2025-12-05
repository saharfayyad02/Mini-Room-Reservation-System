import z, { ZodType } from "zod"
import { CreateBookingDto, updatedBookingDto } from "../dto/create-booking.dto"
import { paginationSchema } from "src/modules/utils/api.util";
import { PaginationQueryType } from "src/types/util.types";


export const CreateBookingSchema = z.object({
   roomId: z.coerce.number(),
   checkIn: z.string().datetime().transform((val) => new Date(val)),
   checkOut: z.string().datetime().transform((val) => new Date(val)), 
}) satisfies ZodType<CreateBookingDto>;

export const UpdateBookingDtoSchema = z.object({
    status: z.enum(['CONFIRMED','CANCELLED','PENDING']),
})satisfies ZodType<updatedBookingDto>;

export const BookingSchema =  paginationSchema.extend({
    name: z.string().min(1).max(50).optional(),
})satisfies ZodType<PaginationQueryType>