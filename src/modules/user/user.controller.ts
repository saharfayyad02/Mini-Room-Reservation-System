import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { paginationSchema } from '../utils/api.util';
import { PaginationQueryType } from 'src/types/util.types';
import { Roles } from 'src/decoraters/roels.decore';


@Controller('user')
@Roles(["ADMIN"])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return this.userService.findAll({
      limit: Number(query.limit) ,
      page: Number(query.page) ,
    } as Required<PaginationQueryType>);
  }

  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(BigInt(id));
  }

  // delete user by admin only and let the owner id refer to admin that deleted his account
  @Delete(':id')
  remove(@Param('id') id: bigint,@Req() req: Express.Request) {
    return this.userService.remove(id,req.user!.id);
  }
}
