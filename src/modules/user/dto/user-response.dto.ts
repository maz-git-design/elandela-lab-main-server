import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { CreateUserDto } from './user.dto';

export class UserResponseDto extends CreateUserDto {
  @Expose()
  username: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  gender?: string;

  @Expose()
  fromActiveDirectory?: boolean;

  @Expose()
  roles?: Types.ObjectId[];

  @Expose()
  customPermissions?: Types.ObjectId[];

  @Expose()
  email?: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  birthday?: Date;

  @Expose()
  status?: any;

  @Expose()
  statusHistory?: any[];

  @Expose()
  faceFingerprint?: any;

  @Expose()
  cohortId?: Types.ObjectId;

  @Expose()
  identificationNumber: string;
}
