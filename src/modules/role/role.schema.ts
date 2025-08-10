import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop() description: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
  permissions: Types.ObjectId[];
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
