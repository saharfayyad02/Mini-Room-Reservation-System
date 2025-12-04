import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/pips/zod.validation.pipe';
import { paginationSchema } from '../utils/api.util';
import { PaginationQueryType } from 'src/types/util.types';
import { Roles } from 'src/decoraters/roels.decore';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: createUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  @Roles(["ADMIN","OWNER"])
  findAll(@Query(new ZodValidationPipe(paginationSchema)) query: {page: 1; limit: 10;}) {
    return this.userService.findAll({
      limit: Number(query.limit) ,
      page: Number(query.page) ,
    } as Required<PaginationQueryType>);
  }

  @Roles(["ADMIN","OWNER"])
  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(BigInt(id));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
