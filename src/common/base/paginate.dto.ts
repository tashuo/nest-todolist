import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { toNumber } from 'lodash';

export class PaginateDto {
  @ApiPropertyOptional({
    description: '页码',
  })
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: 'must larger than 0' })
  readonly page: number = 1;

  @ApiPropertyOptional({
    description: '数量',
  })
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: 'must larger than 0' })
  readonly limit: number = 10;
}
