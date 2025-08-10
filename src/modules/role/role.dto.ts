import { IsString, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: Types.ObjectId[];
}
