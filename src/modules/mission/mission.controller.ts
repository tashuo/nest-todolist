import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { MissionService } from './mission.service';
import { CreateMissionDto, QueryMissionDto } from './dto/mission.dto';
import { UpdateMissionDto } from './dto/mission.dto';
import { User } from 'src/common/decorators/user.decorator';
import { BaseController } from 'src/common/base/controller.base';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { MissionEntity } from './entities/mission.entity';
import { CommonResponseDto } from './dto/common.response.dto';
import { GenerateSwaggerResponse } from '../../common/decorators/response.decorator';
import { CustomBaseResponse } from 'src/common/base/response.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { PaginateDto } from 'src/common/base/paginate.dto';

@ApiTags('任务')
@ApiBearerAuth()
@Controller('mission')
export class MissionController extends BaseController {
  constructor(private readonly missionService: MissionService) {
    super();
  }

  @ApiExtraModels(MissionEntity)
  @GenerateSwaggerResponse(MissionEntity, 'single')
  @Post('')
  async create(
    @User() user,
    @Body() createMissionDto: CreateMissionDto,
  ): Promise<CustomBaseResponse<MissionEntity>> {
    return this.successResponse(
      await this.missionService.create(createMissionDto, user),
    );
  }

  @GenerateSwaggerResponse(MissionEntity, 'page')
  @Get()
  async findAll(
    @Query() pageDto: QueryMissionDto,
    @User() user: UserEntity,
  ): Promise<CustomBaseResponse<MissionEntity>> {
    return this.successResponse(
      await this.missionService.paginate(user.id, pageDto),
    );
  }

  @GenerateSwaggerResponse(MissionEntity, 'single')
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<CommonResponseDto<MissionEntity>> {
    return this.successResponse(await this.missionService.findOne(+id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMissionDto: UpdateMissionDto,
    @User() user: UserEntity,
  ) {
    const mission = await MissionEntity.findOne({
      where: { id },
      relations: ['user'],
    });
    if (isNil(mission) || mission.user.id !== user.id) {
      return this.failedResponse();
    }
    return this.successResponse(
      await this.missionService.update(mission, updateMissionDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @User() user: UserEntity) {
    const mission = await MissionEntity.findOne({
      where: { id },
      relations: ['user'],
    });
    if (isNil(mission) || mission.user.id !== user.id) {
      return this.failedResponse();
    }
    MissionEntity.createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();
    return this.successResponse();
  }

  @Post(':id/comment')
  async comment(
    @Param('id') id: number,
    @User() user,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CustomBaseResponse<MissionEntity>> {
    const mission = await MissionEntity.findOneBy({
      id,
    });
    if (isNil(mission)) {
      return this.failedResponse('mission not exist');
    }
    return this.successResponse(
      await this.missionService.createComment(
        mission,
        user,
        createCommentDto.content,
      ),
    );
  }

  @Get(':id/comments')
  async comments(
    @Param('id') id: number,
    @Query() pageDto: PaginateDto,
  ): Promise<CommonResponseDto<MissionEntity>> {
    const mission = await MissionEntity.findOneBy({
      id,
    });
    if (isNil(mission)) {
      return this.failedResponse('mission not exist');
    }
    return this.successResponse(
      await this.missionService.getCommentPaginations(mission, pageDto),
    );
  }
}
