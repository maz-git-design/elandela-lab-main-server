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
import { DepartmentService } from './department.service';
import { Department } from './department.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Create' }])
  create(@Body() data: Partial<Department>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.departmentService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Read' }])
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() data: Partial<Department>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.departmentService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Department>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.departmentService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.departmentService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'department', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.departmentService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.departmentService.filter(filterDto);
  }
}
