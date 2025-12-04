import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import * as argon from 'argon2'
import { Role } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService,
              private configService:ConfigService
  ){}
  async create(createAuthDto: RegisterDTO):Promise<UserResponseDTO> {
    // hash password
    const hashPass = await this.hashPassward(createAuthDto.password);
    // create user in db
    const user = await this.userService.create({...createAuthDto,password:hashPass});
    // generate jwt token
    const token = await this.generateJwtToken(BigInt(user.id),user.role)
    // const userWithoutPass = removeFields(await user,['password'])
    return {
      user:this.userService.mapwithoutPasswordAndCastBigInt(await user),
      token,
    }
    // return user data + token
   }

    async login(LoginUser: LoginDTO):Promise<UserResponseDTO> {

      // find the user by email\
      const user = await this.userService.findbyemail(LoginUser.email);

      if(!user){
        throw new UnauthorizedException('Invalid credentials')
      }
      // verfiy passowrd with argon
      const verifiyPassword = await this.verifyPasswarrd(LoginUser.password,user.password);
      if(!verifiyPassword){
        throw new UnauthorizedException('Invalid credentials')
      }
      // generate jwt token
      const Generatedtoken = await this.generateJwtToken(BigInt(user.id),user.role)
      return {
        user:this.userService.mapwithoutPasswordAndCastBigInt(user),
        token: Generatedtoken
      }
   }


  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  private hashPassward(passward:string){
       return argon.hash(passward);
  }
  private verifyPasswarrd(passward:string,hashPassward:string){
      return argon.verify(hashPassward,passward);
  }
  private generateJwtToken(userId:bigint,role: Role){
    console.log("💡 SECRET INSIDE TOKEN:", this.configService.get('JWT_SECRET'));
    return this.jwtService.sign({sub:String(userId),role})
  }
}
