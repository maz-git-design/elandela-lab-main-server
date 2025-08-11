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
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreatePermissionDto } from './permission.dto';
import { UpdatePermissionDto } from './update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Create' }])
  create(@Body() createPermissionDto: CreatePermissionDto, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.permissionService.create(createPermissionDto, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Read' }])
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.permissionService.update(id, updatePermissionDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Permission>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.permissionService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.permissionService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'permission', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.permissionService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.permissionService.filter(filterDto);
  }
}
