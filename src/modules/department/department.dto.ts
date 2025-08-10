import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  adId?: string;

  @IsOptional()
  headOfDepartment?: Types.ObjectId;

  @IsOptional()
  deputyChef?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  cohorts?: Types.ObjectId[];

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
