import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MissionEntity } from './mission.entity';

@Entity('mission_users')
@Index('idx_mission_create', ['mission', 'created_at'])
@Index('idx_user_create', ['user', 'created_at'])
export class MissionUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => MissionEntity)
  mission: MissionEntity;

  @Exclude()
  @CreateDateColumn({ comment: '创建日期' })
  created_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at?: Date;
}
