import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateCommentDto {
  /**
   * 内容
   * @example 收到
   */
  @ApiProperty({
    description: '评论内容',
  })
  @Length(1, 1000)
  readonly content: string;
}
