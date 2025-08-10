import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lab, LabDocument } from './lab.schema';

@Injectable()
export class LabService {
  constructor(@InjectModel(Lab.name) readonly labModel: Model<LabDocument>) {}

  async create(data: Partial<Lab>, userId?: string): Promise<Lab> {
    // Optionally use userId for audit/history
    return this.labModel.create(data);
  }

  async findAll(): Promise<Lab[]> {
    return this.labModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Lab> {
    const lab = await this.labModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!lab) throw new NotFoundException('Lab not found');
    return lab;
  }

  async update(id: string, data: Partial<Lab>, userId?: string): Promise<Lab> {
    return this.labModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async softDelete(id: string, userId?: string) {
    const labDoc = await this.labModel.findOne({ _id: id });
    if (!labDoc) throw new NotFoundException('Lab not found');
    await (labDoc as any).delete();
    return labDoc;
  }

  async restore(id: string, userId?: string): Promise<Lab> {
    const labDoc = await this.labModel.findOne({ _id: id });
    if (!labDoc) throw new NotFoundException('Lab not found');
    await (labDoc as any).restore();
    return labDoc;
  }

  async updateStatus(id: string, status: string) {
    const lab = await this.labModel.findOne({ _id: id });
    if (!lab) throw new NotFoundException('Lab not found');
    lab.status = status;
    await lab.save();
    return lab;
  }

  async updateManagers(id: string, managers: any) {
    const lab = await this.labModel.findOne({ _id: id });
    if (!lab) throw new NotFoundException('Lab not found');
    lab.managers = managers;
    await lab.save();
    return lab.managers;
  }

  async filter(filterDto: any): Promise<Lab[]> {
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
    let q = this.labModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
