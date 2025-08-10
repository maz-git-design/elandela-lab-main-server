import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'Module' }) moduleId: Types.ObjectId;
  @Prop({ type: [String] }) actions: string[];
  @Prop() createdAt: Date;
  @Prop() updatedAt: Date;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
