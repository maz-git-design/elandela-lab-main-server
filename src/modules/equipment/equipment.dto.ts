import { IsString, IsOptional, IsArray, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  categoryId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsArray()
  specs?: { name: string; description: string }[];

  @IsOptional()
  @IsArray()
  usageStatus?: any[];

  @IsOptional()
  currentStatus?: any;

  @IsOptional()
  @IsArray()
  labs?: any[];

  @IsOptional()
  currentLabId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @IsDate()
  entryDate?: Date;

  @IsOptional()
  @IsArray()
  swapHistory?: any[];

  @IsOptional()
  @IsArray()
  accessories?: Types.ObjectId[];
}
