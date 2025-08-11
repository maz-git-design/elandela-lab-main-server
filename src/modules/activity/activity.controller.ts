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
import { ActivityService } from './activity.service';
import { Activity } from './activity.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateActivityDto } from './activity.dto';
import { UpdateActivityDto } from './update-activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Create' }])
  create(@Body() createActivityDto: CreateActivityDto, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.activityService.create(createActivityDto, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Read' }])
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.activityService.update(id, updateActivityDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Activity>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.activityService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.activityService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'activity', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.activityService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.activityService.filter(filterDto);
  }
}
