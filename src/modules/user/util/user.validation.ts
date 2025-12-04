import { User } from "generated/prisma";
import z, { ZodType } from "zod";
import { UpdateUserDtoType } from "../dto/update.user.dto";


export const UserValidationSchema = z.object({
    name:z.string().min(0).max(20),
    email:z.email(),
    password : z.string(),
    role: z.enum(['ADMIN','OWNER','GUEST'])
}) satisfies ZodType <Omit<User, 'updatedAt' | 'createdAt' | 'id' >>;

export const UpdateValidationSchema = UserValidationSchema.
pick({name:true,password:true}).partial() satisfies ZodType <UpdateUserDtoType> 