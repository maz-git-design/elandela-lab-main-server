import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EquipmentCategory,
  EquipmentCategorySchema,
} from './equipmentCategory.schema';
import { EquipmentCategoryService } from './equipmentCategory.service';
import { EquipmentCategoryController } from './equipmentCategory.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EquipmentCategory.name, schema: EquipmentCategorySchema },
    ]),
  ],
  controllers: [EquipmentCategoryController],
  providers: [EquipmentCategoryService],
  exports: [EquipmentCategoryService],
})
export class EquipmentCategoryModule {}
