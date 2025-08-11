import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  Patch,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.schema';
import { RolesActionsGuard } from '../auth/roles-actions.guard';
import { CreateAttendanceDto } from './attendance.dto';
import { UpdateAttendanceDto } from './update-attendance.dto';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Create' }])
  create(@Body() createAttendanceDto: CreateAttendanceDto, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.attendanceService.create(createAttendanceDto, userId);
  }

  @Get()
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Read' }])
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Read' }])
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Update' }])
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.attendanceService.update(id, updateAttendanceDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Update' }])
  partialUpdate(
    @Param('id') id: string,
    @Body() data: Partial<Attendance>,
    @Request() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    return this.attendanceService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Delete' }])
  softDelete(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.attendanceService.softDelete(id, userId);
  }

  @Put('restore/:id')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Restore' }])
  restore(@Param('id') id: string, @Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.attendanceService.restore(id, userId);
  }

  @Get('reservation/:reservationId')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Read' }])
  getByReservation(@Param('reservationId') reservationId: string) {
    return this.attendanceService.getByReservation(reservationId);
  }

  @Get('user/:userId')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Read' }])
  getByUser(@Param('userId') userId: string) {
    return this.attendanceService.getByUser(userId);
  }

  @Post('filter')
  @UseGuards(RolesActionsGuard)
  @SetMetadata('permissions', [{ module: 'attendance', action: 'Filter' }])
  filter(@Body() filterDto: any) {
    return this.attendanceService.filter(filterDto);
  }
}
