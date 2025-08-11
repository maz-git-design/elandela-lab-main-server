import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from './module.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
