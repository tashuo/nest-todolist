import { OrderType } from 'src/constants/app';
import { PaginateDto } from './paginate.dto';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListDto extends PaginateDto {
  @ApiPropertyOptional({
    description: '排序字段',
  })
  @IsOptional()
  orderBy?: string;

  @ApiPropertyOptional({
    description: '升序ASC,降序DESC',
  })
  @IsOptional()
  orderByDirection?: OrderType;
}
