import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Reservation' })
  reservationId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) userId: Types.ObjectId;
  @Prop({ enum: ['present', 'absent', 'late', 'left_early'] }) status: string;
  @Prop() confirmedAt: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' }) confirmedBy: Types.ObjectId;
  @Prop() comments: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
