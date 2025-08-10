import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type AcademicYearDocument = AcademicYear & Document;

@Schema({ timestamps: true })
export class AcademicYear {
  @Prop({ required: true }) startingYear: number;
  @Prop({ required: true }) endingYear: number;
  @Prop() status: string;
  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt: Date;
}

export const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear);
AcademicYearSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
