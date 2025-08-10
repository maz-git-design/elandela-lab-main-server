import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type CohortDocument = Cohort & Document;

@Schema({ timestamps: true })
export class Cohort {
  @Prop({ required: true }) name: string;
  @Prop({ type: Types.ObjectId, ref: 'AcademicYear' })
  academicYear: Types.ObjectId;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'Department' })
  departmentId: Types.ObjectId;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const CohortSchema = SchemaFactory.createForClass(Cohort);
CohortSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
