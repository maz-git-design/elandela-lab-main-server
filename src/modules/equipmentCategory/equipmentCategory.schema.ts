import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type EquipmentCategoryDocument = EquipmentCategory & Document;

@Schema({ timestamps: true })
export class EquipmentCategory {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop() imagePath: string;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const EquipmentCategorySchema =
  SchemaFactory.createForClass(EquipmentCategory);
EquipmentCategorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
