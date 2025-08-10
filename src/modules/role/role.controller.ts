import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  Patch,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Create' }])
  create(@Body() data: Partial<Role>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.roleService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Read' }])
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Update' }])
  update(@Param('id') id: string, @Body() data: Partial<Role>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.roleService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Role>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.roleService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.roleService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'role', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.roleService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.roleService.filter(filterDto);
  }

  @Post('advanced-filter')
  advancedFilter(@Body() filterDto: any) {
    return this.roleService.advancedFilter(filterDto);
  }
}
