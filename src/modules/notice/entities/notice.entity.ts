import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('notices')
@Index('idx_user_created_read', ['user', 'created_at', 'is_read'])
export class NoticeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ comment: '类型' })
  type: number;

  @Exclude()
  @Column({ comment: '目标ID,如任务ID、评论ID等' })
  target_id: number;

  @Column({ comment: '内容', length: 1000 })
  content: string;

  @Exclude()
  @Column({ comment: '是否已读' })
  is_read: boolean;

  @Exclude()
  @CreateDateColumn({ comment: '创建日期' })
  created_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at?: Date;
}
