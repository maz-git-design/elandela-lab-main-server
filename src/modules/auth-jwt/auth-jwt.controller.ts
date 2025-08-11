import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { AuthJwtService } from './auth-jwt.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('auth-jwt')
export class AuthJwtController {
  constructor(private readonly authJwtService: AuthJwtService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    // Passport will attach user to req.user and create a session
    return { user: req.user };
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authJwtService.register(data);
  }

  @Get('me')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'auth-jwt', action: 'ReadProfile' }])
  async getProfile(@Request() req) {
    return req.user;
  }
}
