import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(
    data: Partial<Attendance>,
    userId?: string,
  ): Promise<Attendance> {
    // Optionally use userId for audit/history, e.g. log who created
    // Example: await this.auditService.logCreate('Attendance', userId, data);
    return this.attendanceModel.create(data);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  async update(
    id: string,
    data: Partial<Attendance>,
    userId?: string,
  ): Promise<Attendance> {
    // Optionally use userId for audit/history
    return this.attendanceModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async softDelete(id: string, userId?: string) {
    const attendanceDoc = await this.attendanceModel.findOne({ _id: id });
    if (!attendanceDoc) throw new NotFoundException('Attendance not found');
    await (attendanceDoc as any).delete();
    return attendanceDoc;
  }

  async restore(id: string, userId?: string): Promise<Attendance> {
    const attendanceDoc = await this.attendanceModel.findOne({ _id: id });
    if (!attendanceDoc) throw new NotFoundException('Attendance not found');
    await (attendanceDoc as any).restore();
    return attendanceDoc;
  }

  async getByReservation(reservationId: string) {
    return this.attendanceModel.find({ reservationId }).exec();
  }

  async getByUser(userId: string) {
    return this.attendanceModel.find({ userId }).exec();
  }

  async filter(filterDto: any): Promise<Attendance[]> {
    const query: any = { isDeleted: false };
    if (filterDto.fromDate || filterDto.toDate) {
      query.createdAt = {};
      if (filterDto.fromDate)
        query.createdAt.$gte = new Date(filterDto.fromDate);
      if (filterDto.toDate) query.createdAt.$lte = new Date(filterDto.toDate);
    }
    if (filterDto.status) {
      query.status = filterDto.status;
    }
    for (const key of Object.keys(filterDto)) {
      if (!['fromDate', 'toDate', 'status', 'sort'].includes(key)) {
        query[key] = filterDto[key];
      }
    }
    let q = this.attendanceModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
