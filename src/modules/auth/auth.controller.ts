import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { loginValidationSchema, registerValidationSchema } from './user.validation.schema';
import { IsPublic } from 'src/decoraters/public.decore';


@Controller('auth')
@IsPublic(true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body(new ZodValidationPipe(registerValidationSchema)) createAuthDto: RegisterDTO):Promise<UserResponseDTO> {
    return await this.authService.create(createAuthDto);
  }

  @Post('/login')
  async login(@Body(new ZodValidationPipe(loginValidationSchema)) LoginUser: LoginDTO):Promise<UserResponseDTO> {
    return await this.authService.login(LoginUser);
  }

 
  //get user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

}
