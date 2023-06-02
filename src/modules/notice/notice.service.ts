import { Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from './notice.dto';
import { NoticeEntity } from './entities/notice.entity';
import { isNil } from 'lodash';

export class NoticeService {
  async paginate(
    userId: number,
    queryDto: QueryDto,
  ): Promise<Pagination<NoticeEntity, any>> {
    console.log(userId, queryDto);
    const query = NoticeEntity.createQueryBuilder()
      .where('userId = :userId', { userId })
      .orderBy('id', 'DESC')
      .offset((queryDto.page - 1) * queryDto.limit)
      .limit(queryDto.limit);
    if (!isNil(queryDto.isRead)) {
      console.log(queryDto.isRead);
      console.log(typeof queryDto.isRead);
      query.andWhere('is_read = :isRead', {
        isRead: queryDto.isRead,
      });
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
}
