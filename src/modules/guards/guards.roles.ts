import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException ,CanActivate} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma';
import { Roles } from 'src/decoraters/roels.decore';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  
  constructor(private refloctor: Reflector){}

  async canActivate(context: ExecutionContext){
    const roles = this.refloctor.getAllAndOverride<Role>(Roles,[context.getHandler(),context.getClass()])
    if(!roles){
      return true;
    }
    // http
    const { user } = context.switchToHttp().getRequest<Request>();
    if(!user){
        throw new UnauthorizedException('User not found in request');
    }
    if(!roles.includes(user.role)){
        throw new ForbiddenException('User does not have the required role');
    }
    return true;
  }

}
