import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from './entities/mission.entity';
import { MissionUserEntity } from './entities/user.mission.entity';
import { CommentEntity } from './entities/comment.entity';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';

@Module({
  providers: [MissionService],
  controllers: [MissionController],
  imports: [
    TypeOrmModule.forFeature([MissionEntity, MissionUserEntity, CommentEntity]),
  ],
})
export class MissionModule {}
