import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, Length } from 'class-validator';
import { ListDto } from 'src/common/base/list.dto';

export class CreateMissionDto {
  @ApiProperty({
    description: '内容',
  })
  @Length(1, 1000)
  readonly content: string;

  @ApiProperty({
    description: '成员列表',
  })
  @IsArray()
  @IsOptional()
  readonly members: number[];

  @ApiProperty({
    description: '计划完成时间',
  })
  readonly expired_at: Date;
}

export class UpdateMissionDto extends CreateMissionDto {}

export class QueryMissionDto extends ListDto {
  @ApiPropertyOptional({
    description: '创建人',
  })
  @IsOptional()
  user?: number;

  @ApiPropertyOptional({
    description: '创建时间-起始',
  })
  @IsOptional()
  createdFrom?: Date;

  @ApiPropertyOptional({
    description: '创建时间-结束',
  })
  @IsOptional()
  createdTo?: Date;
}
