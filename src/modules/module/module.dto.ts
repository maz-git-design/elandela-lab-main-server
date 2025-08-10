import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  parentId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(['Create', 'Update', 'List', '*'], { each: true })
  availableActions?: string[];
}
