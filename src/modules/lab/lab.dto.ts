import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class CreateLabDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  departmentId?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  equipmentList?: Types.ObjectId[];

  @IsOptional()
  @IsObject()
  location?: any;

  @IsOptional()
  @IsObject()
  capacities?: any;

  @IsOptional()
  @IsArray()
  openingHours?: any[];

  @IsOptional()
  @IsArray()
  timetable?: any[];

  @IsOptional()
  @IsArray()
  safetyRequirements?: string[];

  @IsOptional()
  @IsObject()
  accessRestrictions?: any;

  @IsOptional()
  @IsObject()
  managers?: any;

  @IsOptional()
  @IsString()
  status?: string;
}
