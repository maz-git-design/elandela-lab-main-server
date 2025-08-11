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
import { LabService } from './lab.service';
import { Lab } from './lab.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateLabDto } from './lab.dto';
import { UpdateLabDto } from './update-lab.dto';

@Controller('labs')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Create' }])
  create(@Body() createLabDto: CreateLabDto, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.labService.create(createLabDto, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Read' }])
  findAll() {
    return this.labService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.labService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() updateLabDto: UpdateLabDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.labService.update(id, updateLabDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Lab>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.labService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.labService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'lab', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.labService.restore(id, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.labService.updateStatus(id, status);
  }

  @Patch(':id/managers')
  updateManagers(@Param('id') id: string, @Body() managers: any) {
    return this.labService.updateManagers(id, managers);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.labService.filter(filterDto);
  }
}
