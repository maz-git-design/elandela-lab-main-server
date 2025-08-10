import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'Cohort' }) cohortId: Types.ObjectId;
  @Prop() isActive: boolean;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
