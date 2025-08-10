import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    // Passport will attach user to req.user and create a session
    return { user: req.user };
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
