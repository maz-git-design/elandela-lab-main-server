import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateActivityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  cohortId?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
