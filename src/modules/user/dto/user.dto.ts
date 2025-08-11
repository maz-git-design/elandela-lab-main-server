import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDate,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(['M', 'F'])
  gender?: string;

  @IsOptional()
  @IsBoolean()
  fromActiveDirectory?: boolean;

  @IsOptional()
  @IsArray()
  roles?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  customPermissions?: Types.ObjectId[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsOptional()
  @IsObject()
  status?: any;

  @IsOptional()
  @IsArray()
  statusHistory?: any[];

  @IsOptional()
  @IsObject()
  faceFingerprint?: any;

  @IsOptional()
  cohortId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  identificationNumber?: string;
}
