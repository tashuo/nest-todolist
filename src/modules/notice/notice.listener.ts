import { OnEvent } from '@nestjs/event-emitter';
import { CreateMissionEvent } from '../mission/events/create.mission.event';
import { MissionEntity } from '../mission/entities/mission.entity';
import { CreateCommentEvent } from '../mission/events/create.comment.event';
import { CommentEntity } from '../mission/entities/comment.entity';
import { NoticeEntity } from './entities/notice.entity';
import { NOTICE_TYPE_COMMENT, NOTICE_TYPE_MENTION } from './constant';
import { isNil } from 'lodash';

export class NoticeListener {
  @OnEvent('mission.create')
  async handleMissionCreate(payload: CreateMissionEvent) {
    const mission = await MissionEntity.findOne({
      where: { id: payload.missionId },
      relations: ['user', 'members', 'members.user'],
    });
    console.log(mission);
    if (isNil(mission.members)) {
      return;
    }
    NoticeEntity.createQueryBuilder('notice')
      .insert()
      .updateEntity(false)
      .values(
        mission.members.map((member) => {
          return {
            user: member.user,
            type: NOTICE_TYPE_MENTION,
            target_id: payload.missionId,
            content: `your have a new mission [${mission.content}] created by [${mission.user.username}]`,
          } as any;
        }),
      )
      .execute();
  }

  @OnEvent('comment.create')
  async handleCommentCreate(payload: CreateCommentEvent) {
    const comment = await CommentEntity.findOne({
      where: { id: payload.commentId },
      relations: ['user', 'mission', 'mission.user'],
    });
    console.log(comment);
    NoticeEntity.save({
      user: comment.mission.user,
      type: NOTICE_TYPE_COMMENT,
      target_id: payload.commentId,
      content: `your mission [${comment.mission.content}] got comment [${comment.content}] by [${comment.user.username}]`,
    });
  }
}
