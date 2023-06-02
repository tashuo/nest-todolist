import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { CreateMissionDto } from './dto/mission.dto';
import { UpdateMissionDto } from './dto/mission.dto';
import { MissionEntity } from './entities/mission.entity';
import { MissionUserEntity } from './entities/user.mission.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMissionEvent } from './events/create.mission.event';
import { QueryMissionDto } from './dto/mission.dto';
import { isNil } from 'lodash';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CommentEntity } from './entities/comment.entity';
import { PaginateDto } from 'src/common/base/paginate.dto';
import { CreateCommentEvent } from './events/create.comment.event';

@Injectable()
export class MissionService {
  constructor(protected readonly eventEmitter: EventEmitter2) {}

  async create({ members, ...data }: CreateMissionDto, user: UserEntity) {
    const mission = await MissionEntity.save({
      ...data,
      user: user,
    });

    if (!isNil(members)) {
      await MissionUserEntity.createQueryBuilder()
        .insert()
        .updateEntity(false)
        .values(
          members.map((userId) => {
            return { user: userId, mission: mission.id } as any;
          }),
        )
        .execute();
    }

    this.eventEmitter.emit(
      'mission.create',
      new CreateMissionEvent({
        missionId: mission.id,
      }),
    );

    return await MissionEntity.findOne({
      where: { id: mission.id },
      relations: ['user', 'members', 'members.user'],
    });
  }

  async paginate(
    userId: number,
    queryDto: QueryMissionDto,
  ): Promise<Pagination<MissionEntity, any>> {
    console.log(userId, queryDto);
    const query = MissionEntity.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.members', 'members')
      .leftJoinAndSelect('members.user', 'user')
      .where('members.userId = :userId', { userId })
      .offset((queryDto.page - 1) * queryDto.limit)
      .limit(queryDto.limit);
    if (!isNil(queryDto.user)) {
      query.andWhere('mission.userId = :createUserId', {
        createUserId: queryDto.user,
      });
    }
    if (!isNil(queryDto.createdFrom)) {
      query.andWhere('mission.created_at >= :createdFrom', {
        createdFrom: queryDto.createdFrom,
      });
    }
    if (!isNil(queryDto.createdTo)) {
      query.andWhere('mission.created_at <= :createdTo', {
        createdTo: queryDto.createdTo,
      });
    }
    if (!isNil(queryDto.orderBy)) {
      query.orderBy(
        `mission.${queryDto.orderBy}`,
        queryDto.orderByDirection ? queryDto.orderByDirection : 'ASC',
      );
    }

    const data = await query.getManyAndCount();
    return {
      items: data[0],
      meta: {
        total: data[1],
        totalPages:
          data[1] % queryDto.limit === 0
            ? Math.floor(data[1] / queryDto.limit)
            : Math.floor(data[1] / queryDto.limit) + 1,
        limit: queryDto.limit,
        nextPage: data[0].length >= queryDto.limit ? queryDto.page + 1 : 0,
      },
    };
  }

  async findOne(id: number) {
    return await MissionEntity.findOne({
      where: { id: id },
      relations: ['user', 'members', 'members.user'],
    });
  }

  async update(mission: MissionEntity, updateMissionDto: UpdateMissionDto) {
    mission.content = updateMissionDto.content;
    return await mission.save();
  }

  async remove(id: number) {
    MissionEntity.delete({ id: id });
    MissionUserEntity.createQueryBuilder()
      .where('missionId = :missionId', { missionId: id })
      .delete()
      .execute();
  }

  async createComment(
    mission: MissionEntity,
    user: UserEntity,
    content: string,
  ) {
    const comment = await CommentEntity.save<CommentEntity>({
      mission,
      user,
      content,
    });

    this.eventEmitter.emit(
      'comment.create',
      new CreateCommentEvent({
        commentId: comment.id,
      }),
    );

    return comment;
  }

  async getCommentPaginations(mission: MissionEntity, queryDto: PaginateDto) {
    const page = queryDto.page ? queryDto.page : 1;
    const limit = queryDto.limit ? queryDto.limit : 10;
    const data = await CommentEntity.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('missionId = :missionId', { missionId: mission.id })
      .orderBy('comment.id', 'DESC')
      .skip((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();
    return {
      items: data[0],
      meta: {
        total: data[1],
        totalPages:
          data[1] % limit === 0
            ? Math.floor(data[1] / limit)
            : Math.floor(data[1] / limit) + 1,
        limit: limit,
        nextPage: data[0].length >= limit ? page + 1 : 0,
      },
    };
  }
}
