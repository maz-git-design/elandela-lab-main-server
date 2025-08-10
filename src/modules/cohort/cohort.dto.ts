import { IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCohortDto {
  @IsString()
  name: string;

  @IsOptional()
  academicYear?: Types.ObjectId;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  departmentId?: Types.ObjectId;
}
