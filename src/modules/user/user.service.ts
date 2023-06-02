import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { isNil } from 'lodash';

@Injectable()
export class UserService {
  async findByName(username: string) {
    return await UserEntity.findBy({ username: username });
  }

  async register(createDto: CreateUserDto): Promise<UserEntity> {
    const user = await UserEntity.findOneBy({ username: createDto.username });
    if (user) {
      throw new BadRequestException('username exists!');
    }
    const new_user = new UserEntity();
    new_user.username = createDto.username;
    new_user.password = await bcrypt.hashSync(createDto.password as string, 10);
    await new_user.save();
    return new_user;
  }

  async login(loginDto: LoginDto) {
    const user = await UserEntity.findOneBy({ username: loginDto.username });
    return !isNil(user) &&
      (await bcrypt.compare(loginDto.password, user.password))
      ? user
      : null;
  }
}
