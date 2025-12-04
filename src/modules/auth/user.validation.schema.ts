import { ZodType } from "zod";
import { UserValidationSchema } from "../user/util/user.validation";
import { LoginDTO } from "./dto/create-auth.dto";


export const registerValidationSchema = UserValidationSchema;

export const loginValidationSchema = UserValidationSchema.pick({
  email: true,
  password: true,
})satisfies ZodType<LoginDTO>;