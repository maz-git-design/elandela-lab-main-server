import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Request,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Create' }])
  create(@Body() data: Partial<Reservation>, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.reservationService.create(data, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Read' }])
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() data: Partial<Reservation>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.reservationService.update(id, data, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Reservation>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.reservationService.partialUpdate(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.reservationService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.reservationService.restore(id, userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'reservation', action: 'UpdateStatus' },
  ])
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reservationService.updateStatus(id, status);
  }

  @Post(':id/comments')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'AddComment' }])
  addComment(@Param('id') id: string, @Body() comment: any) {
    return this.reservationService.addComment(id, comment);
  }

  @Get(':id/comments')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [
    { module: 'reservation', action: 'GetComments' },
  ])
  getComments(@Param('id') id: string) {
    return this.reservationService.getComments(id);
  }

  @Post('filter')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'reservation', action: 'Filter' }])
  filter(@Body() filterDto: any) {
    return this.reservationService.filter(filterDto);
  }
}
