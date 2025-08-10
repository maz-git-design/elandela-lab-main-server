import {
  IsOptional,
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReservationDto {
  @IsOptional()
  @IsArray()
  activities?: Types.ObjectId[];

  @IsOptional()
  userId?: Types.ObjectId;

  @IsOptional()
  labId?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  equipmentIds?: Types.ObjectId[];

  @IsOptional()
  @IsDateString()
  requestedAt?: Date;

  @IsOptional()
  @IsDateString()
  desiredStartTime?: Date;

  @IsOptional()
  @IsDateString()
  desiredEndTime?: Date;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'suggested', 'cancelled'])
  status?: string;

  @IsOptional()
  managerId?: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  managerDecisionAt?: Date;

  @IsOptional()
  @IsString()
  managerComments?: string;

  @IsOptional()
  suggestion?: any;

  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @IsOptional()
  @IsArray()
  history?: any[];

  @IsOptional()
  @IsArray()
  notificationIds?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  comments?: any[];

  @IsOptional()
  @IsEnum(['individual', 'group', 'lecturerUse'])
  reservationType?: string;

  @IsOptional()
  @IsArray()
  groupMembers?: Types.ObjectId[];

  @IsOptional()
  @IsEnum(['student', 'lecturer', 'staff'])
  requesterRole?: string;
}
