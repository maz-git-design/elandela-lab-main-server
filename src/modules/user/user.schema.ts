import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop({ enum: ['M', 'F'] }) gender: string;
  @Prop({ default: false }) fromActiveDirectory: boolean;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
  customPermissions: Types.ObjectId[];
  @Prop() email: string;
  @Prop() phoneNumber: string;
  @Prop() birthday: Date;
  @Prop({
    type: {
      state: {
        type: String,
        enum: ['activated', 'suspended', 'pending', 'deleted'],
      },
      updatedAt: Date,
      updatedBy: { type: Types.ObjectId, ref: 'User' },
    },
  })
  status: any;
  @Prop({
    type: [
      {
        state: String,
        updatedAt: Date,
        updatedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
  })
  statusHistory: any[];
  @Prop({
    type: {
      encodingVector: [Number],
      registeredAt: Date,
      updatedAt: Date,
      isActive: Boolean,
    },
  })
  faceFingerprint: any;
  @Prop({ type: Types.ObjectId, ref: 'Cohort' }) cohortId: Types.ObjectId;
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
  @Prop() identificationNumber: string;
  @Prop({ default: false })
  mustSetNewPassword: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
