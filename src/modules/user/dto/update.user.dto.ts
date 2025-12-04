import { User } from "generated/prisma";

export type UpdateUserDtoType = Partial<Pick<User, 'name' | 'email'>>;  
