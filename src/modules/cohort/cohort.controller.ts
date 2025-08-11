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
import { CohortService } from './cohort.service';
import { Cohort } from './cohort.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateCohortDto } from './cohort.dto';
import { UpdateCohortDto } from './update-cohort.dto';

@Controller('cohorts')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Create' }])
  create(@Body() createCohortDto: CreateCohortDto, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.cohortService.create(createCohortDto, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Read' }])
  findAll() {
    return this.cohortService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.cohortService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() updateCohortDto: UpdateCohortDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.cohortService.update(id, updateCohortDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Cohort>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.cohortService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.cohortService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'cohort', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.cohortService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.cohortService.filter(filterDto);
  }
}
