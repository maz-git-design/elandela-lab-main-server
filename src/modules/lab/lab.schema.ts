import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type LabDocument = Lab & Document;

@Schema({ timestamps: true })
export class Lab {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) code: string;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'Department' })
  departmentId: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Equipment' }] })
  equipmentList: Types.ObjectId[];
  @Prop({
    type: {
      building: String,
      roomNumber: String,
      floor: Number,
    },
  })
  location: any;
  @Prop({
    type: {
      users: Number,
      equipment: Number,
    },
  })
  capacities: any;
  @Prop({
    type: [
      {
        day: String,
        openTime: String,
        closeTime: String,
      },
    ],
  })
  openingHours: any[];
  @Prop({
    type: [
      {
        day: String,
        startTime: String,
        endTime: String,
        activity: String,
        reservedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
  })
  timetable: any[];
  @Prop({ type: [String] }) safetyRequirements: string[];
  @Prop({
    type: {
      allowedRoles: [String],
      minLevel: Number,
    },
  })
  accessRestrictions: any;
  @Prop({
    type: {
      students: [{ type: Types.ObjectId, ref: 'User' }],
      lecturers: [{ type: Types.ObjectId, ref: 'User' }],
      admins: [{ type: Types.ObjectId, ref: 'User' }],
    },
  })
  managers: any;
  @Prop() status: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const LabSchema = SchemaFactory.createForClass(Lab);
LabSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
