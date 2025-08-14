import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Session,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { RolesActionsGuard } from './roles-actions.guard';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from '../user/user.schema';

@UseInterceptors(CurrentUserInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Serialize(UserResponseDto)
  async login(
    @Session() session: Record<string, any>,
    @Body() loginDto: LoginDto,
  ) {
    const result = await this.authService.login(loginDto);
    // Store user info in session cookie
    session.userId = result._id;
    return result;
  }

  @Post('signup')
  @Serialize(UserResponseDto)
  async signup(
    @Body() signupDto: SignupDto,
    @Session() session: Record<string, any>,
  ) {
    const user = this.authService.signup(signupDto);

    session.userId = (await user)._id;
    return user;
  }

  @Get('profile')
  @UseGuards(RolesActionsGuard)
  // @SetMetadata('permissions', [{ module: 'auth', action: 'ReadProfile' }])
  @Serialize(UserResponseDto)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Post('reset-password')
  async resetPassword(
    @Body('username') username: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(username, newPassword);
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    session.userId = null;
    return { message: 'Logged out successfully' };
  }
}
