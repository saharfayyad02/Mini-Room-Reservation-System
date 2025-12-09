import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  exports:[RoomService],
  imports:[FileModule]
})
export class RoomModule {}
