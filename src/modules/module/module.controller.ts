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
import { ModuleService } from './module.service';
import { Module } from './module.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Create' }])
  create(@Body() data: Partial<Module>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.moduleService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Read' }])
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() data: Partial<Module>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.moduleService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Module>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.moduleService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.moduleService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'module', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.moduleService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    // filterDto: { fromDate, toDate, status, sort, ...otherFields }
    return this.moduleService.filter(filterDto);
  }
}
