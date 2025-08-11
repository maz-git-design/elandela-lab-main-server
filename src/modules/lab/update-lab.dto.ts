import { PartialType } from '@nestjs/mapped-types';
import { CreateLabDto } from './lab.dto';

export class UpdateLabDto extends PartialType(CreateLabDto) {}
