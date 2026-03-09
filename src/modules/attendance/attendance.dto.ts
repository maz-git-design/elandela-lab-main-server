import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @IsOptional()
  reservationId?: Types.ObjectId;

  @IsOptional()
  userId?: Types.ObjectId;

  @IsOptional()
  @IsEnum(['present', 'absent', 'late', 'left_early'])
  status?: string;

  @IsOptional()
  @IsDateString()
  confirmedAt?: Date;

  @IsOptional()
  confirmedBy?: Types.ObjectId;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  lab?: string;

  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @IsOptional()
  @IsDateString()
  checkOut?: Date;
}
