import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { BookingModule } from './modules/booking/booking.module';
import { RoomModule } from './modules/room/room.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvVariables } from './types/decleration-merging';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/guards/guards.auth';
import { RoleGuard } from './modules/guards/guards.roles';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService<EnvVariables>) => ({
        secret: configService.get<string>('JWT_SECRET'), // ✅ Not undefined anymore
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    BookingModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService,   
         
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    }
  ],
 
})
export class AppModule {}
