import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';

export class QueryDto extends PaginateDto {
  @ApiPropertyOptional({
    description: '是否已读',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isRead: boolean;
}
