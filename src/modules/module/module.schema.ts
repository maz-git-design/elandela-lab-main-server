import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  name: string;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'Module', default: null })
  parentId: Types.ObjectId;
  @Prop() path: string;
  @Prop({ type: [String], enum: ['Create', 'Update', 'List', '*'] })
  availableActions: string[];
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
ModuleSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
