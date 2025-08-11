import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Request,
  UseGuards,
  SetMetadata,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  Serialize,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';

@Controller('users')
//@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(RolesActionsGuard)
  // @SetMetadata('permissions', [{ module: 'user', action: 'Create' }])
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    console.log('Creating user with data:', createUserDto);
    const userId = req.user?._id || req.user?.id;
    return this.userService.create(createUserDto, userId);
  }

  @Get()
  // @UseGuards(RolesActionsGuard)
  // @SetMetadata('permissions', [{ module: 'user', action: 'Read' }])
  //@UseInterceptors(ClassSerializerInterceptor)
  findAll(@Body('filter') filter?: any) {
    return this.userService.findAll(filter);
  }

  @Get(':id')
  // @UseGuards(RolesActionsGuard)
  // @SetMetadata('permissions', [{ module: 'user', action: 'Read' }])
  //@UseInterceptors(new SerializeInterceptor(UserResponseDto))
  @Serialize(UserResponseDto)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.userService.update(id, updateUserDto, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.userService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.userService.restore(id, userId);
  }

  @Put(':id/status')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  async changeStatus(
    @Param('id') id: string,
    @Body('state') state: string,
    @Body('updatedBy') updatedBy: string,
  ) {
    return this.userService.changeStatus(id, state, updatedBy);
  }

  @Put(':id/reinit-password')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ResetPassword' }])
  async reinitPassword(@Param('id') id: string) {
    return this.userService.reinitPassword(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  updateStatus(
    @Param('id') id: string,
    @Body('state') state: string,
    @Body('updatedBy') updatedBy: string,
  ) {
    return this.userService.changeStatus(id, state, updatedBy);
  }

  @Patch(':id/roles')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  updateRoles(@Param('id') id: string, @Body('roles') roles: string[]) {
    return this.userService.updateRoles(id, roles);
  }

  @Patch(':id/custom-permissions')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  updateCustomPermissions(
    @Param('id') id: string,
    @Body('customPermissions') customPermissions: string[],
  ) {
    return this.userService.updateCustomPermissions(id, customPermissions);
  }

  @Post(':id/face-fingerprint')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  uploadFaceFingerprint(@Param('id') id: string, @Body() data: any) {
    return this.userService.uploadFaceFingerprint(id, data);
  }

  @Get(':id/face-fingerprint')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'Read' }])
  getFaceFingerprint(@Param('id') id: string) {
    return this.userService.getFaceFingerprint(id);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ChangeStatus' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<User>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.userService.update(id, data, userId);
  }

  @Post(':id/request-password-reset')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ResetPassword' }])
  requestPasswordReset(@Param('id') id: string, @Body('email') email: string) {
    return this.userService.requestPasswordReset(id, email);
  }

  @Post(':id/reset-password')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'ResetPassword' }])
  resetPassword(
    @Param('id') id: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.resetPassword(id, token, newPassword);
  }

  @Post('filter')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'user', action: 'Read' }])
  filter(@Body() filterDto: any) {
    return this.userService.filter(filterDto);
  }
}
