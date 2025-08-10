import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type EquipmentDocument = Equipment & Document;

@Schema({ timestamps: true })
export class Equipment {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) code: string;
  @Prop() serialNumber: string;
  @Prop() imagePath: string;
  @Prop({ type: Types.ObjectId, ref: 'EquipmentCategory' })
  categoryId: Types.ObjectId;
  @Prop() model: string;
  @Prop({ type: [{ name: String, description: String }] }) specs: {
    name: string;
    description: string;
  }[];
  @Prop({
    type: [
      {
        state: String,
        updatedAt: Date,
        updatedBy: { type: Types.ObjectId, ref: 'User' },
        isExpirable: Boolean,
        expireDate: Date,
      },
    ],
  })
  usageStatus: any[];
  @Prop({
    type: {
      state: String,
      updatedAt: Date,
      updatedBy: { type: Types.ObjectId, ref: 'User' },
    },
  })
  currentStatus: any;
  @Prop({
    type: [{ labId: { type: Types.ObjectId, ref: 'Lab' }, createdAt: Date }],
  })
  labs: any[];
  @Prop({ type: Types.ObjectId, ref: 'Lab' }) currentLabId: Types.ObjectId;
  @Prop() description: string;
  @Prop() deliveryDate: Date;
  @Prop() entryDate: Date;
  @Prop({
    type: [
      {
        initiatedBy: { type: Types.ObjectId, ref: 'User' },
        swapStatus: String,
        approvedBy: { type: Types.ObjectId, ref: 'User' },
        swappingDate: Date,
      },
    ],
  })
  swapHistory: any[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Equipment' }] })
  accessories: Types.ObjectId[];
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
EquipmentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
