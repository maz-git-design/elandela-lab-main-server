import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
