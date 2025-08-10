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
import { EquipmentService } from './equipment.service';
import { Equipment } from './equipment.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Create' }])
  create(@Body() data: Partial<Equipment>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Read' }])
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() data: Partial<Equipment>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Equipment>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentService.partialUpdate(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipment', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentService.restore(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('state') state: string,
    @Body('updatedBy') updatedBy: string,
  ) {
    return this.equipmentService.updateStatus(id, state, updatedBy);
  }

  @Patch(':id/usage-status')
  addUsageStatus(@Param('id') id: string, @Body() data: any) {
    return this.equipmentService.addUsageStatus(id, data);
  }

  @Post(':id/swap')
  swapEquipment(@Param('id') id: string, @Body() data: any) {
    return this.equipmentService.swapEquipment(id, data);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.equipmentService.filter(filterDto);
  }
}
