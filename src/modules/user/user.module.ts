import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Module({
  providers: [UserService, AuthService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    try {
      UserEntity.createQueryBuilder(UserEntity.name)
        .insert()
        .updateEntity(false)
        .orIgnore()
        .values({
          username: 'Jim',
          password: await bcrypt.hashSync('123456', 10),
        })
        .execute();
      UserEntity.createQueryBuilder(UserEntity.name)
        .insert()
        .updateEntity(false)
        .orIgnore()
        .values({
          username: 'John',
          password: await bcrypt.hashSync('123456', 10),
        })
        .execute();
    } catch (error) {
      console.log('init user failed');
      console.log(error);
    }
  }
}
