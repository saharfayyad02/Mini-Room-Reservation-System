import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { RegisterDTO, UserResponseDTO } from '../auth/dto/create-auth.dto';
import { DatabaseService } from '../database/database.service';
import { removeFields } from '../utils/object';
import { PaginationQueryType } from 'src/types/util.types';
import { email } from 'zod';
import { UpdateUserDtoType } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(private prismaDatabase:DatabaseService){}

  create(createUserDto: RegisterDTO) {
    return this.prismaDatabase.user.create({
        data: createUserDto
    })
  }

  findAll(query:PaginationQueryType):Promise<Omit<User, 'password'>[]> {
    const pagination = this.prismaDatabase.handleQueryPagination(query);
    return this.prismaDatabase.user.findMany({
       ...removeFields(pagination,['page']),
       orderBy: { id: 'desc' },
       select:{
        id: true,
        name:true,
        email:true,
        role:true,
        createdAt: true,
        updatedAt: true
       }
    })
  }

  findOne(id: bigint) {
    return this.prismaDatabase.user.findUniqueOrThrow({
      where : {id},
      select:{
        id: true,
        name:true,
        email:true,
        role:true,
        createdAt: true,
        updatedAt: true,
        password: false,
      }
    });
  }

  findbyemail (email: string) {
    return this.prismaDatabase.user.findUniqueOrThrow({
      where : {email},
      select:{
        id: true,
        name:true,
        email:true,
        role:true,
        createdAt: true,
        updatedAt: true,
        password: true,
      }
    });
  }

  update(id: bigint,userUpdatePay: UpdateUserDtoType){
    return this.prismaDatabase.user.update({
      where : {id},
      data: userUpdatePay,
      select:{
        id: true,
        name:true,
        email:true,
        role:true,
        createdAt: true,
        updatedAt: true,
        password: false,
      }
    })
  }

  async remove(id: bigint, adminId: string) {

    return this.prismaDatabase.$transaction(async (prisma) => {
      // First, delete all bookings associated with the user
      await prisma.booking.deleteMany({
        where: { id: id },
      });

     await this.prismaDatabase.room.updateMany({

        where: { ownerId: id },
        data: { ownerId: BigInt(adminId) }, 
      });

      return prisma.user.findUniqueOrThrow({
        where: { id: BigInt(adminId)},
          include: {
          rooms: true,
          bookings: true,
          },
      })
  })
  }

  mapwithoutPasswordAndCastBigInt(user:User):UserResponseDTO['user']{
    const userWithoutPassword = removeFields(user, ['password']);
    // cast bigint to number
    return {
      ...userWithoutPassword,
      id: String(userWithoutPassword.id),
    };
  }
}
