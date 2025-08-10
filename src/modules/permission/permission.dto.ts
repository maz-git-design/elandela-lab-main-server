import { IsString, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  moduleId?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  actions?: string[];
}
