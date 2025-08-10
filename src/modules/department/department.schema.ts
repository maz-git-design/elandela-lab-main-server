import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true }) name: string;
  @Prop() adId: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) headOfDepartment: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) deputyChef: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Cohort' }] })
  cohorts: Types.ObjectId[];
  @Prop() contactEmail: string;
  @Prop() contactPhone: string;
  @Prop() description: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
DepartmentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
