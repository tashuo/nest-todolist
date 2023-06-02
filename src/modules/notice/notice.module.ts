import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeListener } from './notice.listener';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

@Module({
  providers: [NoticeListener, NoticeService],
  controllers: [NoticeController],
  imports: [TypeOrmModule.forFeature([NoticeEntity])],
})
export class NoticeModule {}
