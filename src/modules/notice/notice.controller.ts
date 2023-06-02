import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/controller.base';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { CustomBaseResponse } from 'src/common/base/response.dto';
import { NoticeEntity } from './entities/notice.entity';
import { QueryDto } from './notice.dto';
import { NoticeService } from './notice.service';

@ApiTags('通知')
@ApiBearerAuth()
@Controller('notice')
export class NoticeController extends BaseController {
  constructor(private readonly noticeService: NoticeService) {
    super();
  }

  @Get()
  async findAll(
    @Query() pageDto: QueryDto,
    @User() user: UserEntity,
  ): Promise<CustomBaseResponse<NoticeEntity>> {
    return this.successResponse(
      await this.noticeService.paginate(user.id, pageDto),
    );
  }
}
