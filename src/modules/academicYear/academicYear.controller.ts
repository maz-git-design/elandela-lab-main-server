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
import { AcademicYearService } from './academicYear.service';
import { AcademicYear } from './academicYear.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Create' }])
  create(@Body() data: Partial<AcademicYear>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.academicYearService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Read' }])
  findAll() {
    return this.academicYearService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.academicYearService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() data: Partial<AcademicYear>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.academicYearService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<AcademicYear>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.academicYearService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.academicYearService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'academicYear', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.academicYearService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.academicYearService.filter(filterDto);
  }
}
