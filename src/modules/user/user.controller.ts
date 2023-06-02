import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Guest } from 'src/common/decorators/guest.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createDto: CreateUserDto) {
    return this.userService.register(createDto);
  }

  @UseGuards(LocalAuthGuard)
  @Guest()
  @Post('login')
  async login(@Req() req, @Body() _dto: LoginDto) {
    return this.authService.login(req.user);
  }
}
