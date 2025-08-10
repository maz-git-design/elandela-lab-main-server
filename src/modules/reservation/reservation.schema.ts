import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Activity' }] })
  activities: Types.ObjectId[];
  @Prop({ type: Types.ObjectId, ref: 'User' }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Lab' }) labId: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Equipment' }] })
  equipmentIds: Types.ObjectId[];
  @Prop() requestedAt: Date;
  @Prop() desiredStartTime: Date;
  @Prop() desiredEndTime: Date;
  @Prop({ enum: ['pending', 'approved', 'rejected', 'suggested', 'cancelled'] })
  status: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) managerId: Types.ObjectId;
  @Prop() managerDecisionAt: Date;
  @Prop() managerComments: string;
  @Prop({
    type: {
      alternativeStartTime: Date,
      alternativeEndTime: Date,
      alternativeLabId: { type: Types.ObjectId, ref: 'Lab' },
      alternativeEquipmentIds: [{ type: Types.ObjectId, ref: 'Equipment' }],
    },
  })
  suggestion: any;
  @Prop({ enum: ['low', 'normal', 'high', 'urgent'] }) priority: string;
  @Prop({
    type: [
      {
        status: String,
        changedAt: Date,
        changedBy: { type: Types.ObjectId, ref: 'User' },
        comment: String,
      },
    ],
  })
  history: any[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }] })
  notificationIds: Types.ObjectId[];
  @Prop({
    type: [
      {
        commenterId: { type: Types.ObjectId, ref: 'User' },
        commentText: String,
        createdAt: Date,
      },
    ],
  })
  comments: any[];
  @Prop({ enum: ['individual', 'group', 'lecturerUse'] })
  reservationType: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  groupMembers: Types.ObjectId[];
  @Prop({ enum: ['student', 'lecturer', 'staff'] }) requesterRole: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
