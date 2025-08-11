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
import { EquipmentCategoryService } from './equipmentCategory.service';
import { EquipmentCategory } from './equipmentCategory.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateEquipmentCategoryDto } from './equipmentCategory.dto';

@Controller('equipment-categories')
export class EquipmentCategoryController {
  constructor(
    private readonly equipmentCategoryService: EquipmentCategoryService,
  ) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'equipmentCategory', action: 'Create' },
  ])
  create(
    @Body() createEquipmentCategoryDto: CreateEquipmentCategoryDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentCategoryService.create(
      createEquipmentCategoryDto,
      userId,
    );
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipmentCategory', action: 'Read' }])
  findAll() {
    return this.equipmentCategoryService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'equipmentCategory', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.equipmentCategoryService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'equipmentCategory', action: 'Update' },
  ])
  update(
    @Param('id') id: string,
    @Body() data: Partial<EquipmentCategory>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentCategoryService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'equipmentCategory', action: 'Update' },
  ])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<EquipmentCategory>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentCategoryService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'equipmentCategory', action: 'Delete' },
  ])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentCategoryService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'equipmentCategory', action: 'Restore' },
  ])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.equipmentCategoryService.restore(id, userId);
  }

  @Post('filter')
  filter(@Body() filterDto: any) {
    return this.equipmentCategoryService.filter(filterDto);
  }
}
