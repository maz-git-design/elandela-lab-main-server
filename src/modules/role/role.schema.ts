import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type RoleDocument = Role & Document;

@Schema({ _id: false })
export class PermissionsByModule {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  moduleId: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  permissions: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop() description: string;
  @Prop({ type: [PermissionsByModule], default: [] })
  permissionsByModule: PermissionsByModule[];
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
