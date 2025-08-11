import { PartialType } from '@nestjs/mapped-types';
import { CreateCohortDto } from './cohort.dto';

export class UpdateCohortDto extends PartialType(CreateCohortDto) {}
