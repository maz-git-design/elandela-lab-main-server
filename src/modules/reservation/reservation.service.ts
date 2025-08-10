import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    readonly reservationModel: Model<ReservationDocument>,
  ) {}

  async create(
    data: Partial<Reservation>,
    userId?: string,
  ): Promise<Reservation> {
    // Optionally use userId for audit/history
    return this.reservationModel.create(data);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async update(
    id: string,
    data: Partial<Reservation>,
    userId?: string,
  ): Promise<Reservation> {
    return this.reservationModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Reservation>,
    userId?: string,
  ): Promise<Reservation> {
    // Optionally use userId for audit/history
    // Only update provided fields, do not overwrite with undefined
    const updateData: Partial<Reservation> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.reservationModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Reservation not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const reservationDoc = await this.reservationModel.findOne({ _id: id });
    if (!reservationDoc) throw new NotFoundException('Reservation not found');
    await (reservationDoc as any).delete();
    return reservationDoc;
  }

  async restore(id: string, userId?: string): Promise<Reservation> {
    const reservationDoc = await this.reservationModel.findOne({ _id: id });
    if (!reservationDoc) throw new NotFoundException('Reservation not found');
    await (reservationDoc as any).restore();
    return reservationDoc;
  }

  async updateStatus(id: string, status: string) {
    const reservation = await this.reservationModel.findOne({ _id: id });
    if (!reservation) throw new NotFoundException('Reservation not found');
    reservation.status = status;
    reservation.history = reservation.history || [];
    reservation.history.push({ status, changedAt: new Date() });
    await reservation.save();
    return reservation.status;
  }

  async addComment(id: string, comment: any) {
    const reservation = await this.reservationModel.findOne({ _id: id });
    if (!reservation) throw new NotFoundException('Reservation not found');
    reservation.comments = reservation.comments || [];
    reservation.comments.push({ ...comment, createdAt: new Date() });
    await reservation.save();
    return reservation.comments;
  }

  async getComments(id: string) {
    const reservation = await this.reservationModel.findOne({ _id: id });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation.comments || [];
  }

  async filter(filterDto: any): Promise<Reservation[]> {
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
    let q = this.reservationModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
