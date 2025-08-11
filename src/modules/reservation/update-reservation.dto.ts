import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
