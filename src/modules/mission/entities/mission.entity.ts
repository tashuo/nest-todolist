import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { MissionUserEntity } from './user.mission.entity';

@Entity('missions')
@Index('idx_user_expired', ['user', 'expired_at'])
@Index('idx_user_created', ['user', 'created_at'])
@Index('idx_expired', ['expired_at'])
@Index('idx_created', ['created_at'])
export class MissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ comment: '任务内容', length: 1000 })
  content: string;

  @CreateDateColumn({ comment: '创建日期' })
  created_at: Date;

  @Column({ comment: '截止日期' })
  expired_at: Date;

  @Exclude()
  @UpdateDateColumn({ comment: '更新日期' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at?: Date;

  @Exclude()
  @OneToMany(() => CommentEntity, (comment) => comment.mission)
  comments: CommentEntity[];

  @OneToMany(() => MissionUserEntity, (missionUser) => missionUser.mission)
  members: MissionUserEntity[];
}
