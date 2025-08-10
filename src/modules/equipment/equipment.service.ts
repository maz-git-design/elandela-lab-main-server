import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from './equipment.schema';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    readonly equipmentModel: Model<EquipmentDocument>,
  ) {}

  async create(data: Partial<Equipment>, userId?: string): Promise<Equipment> {
    // Optionally use userId for audit/history
    return this.equipmentModel.create(data);
  }

  async findAll(): Promise<Equipment[]> {
    return this.equipmentModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!equipment) throw new NotFoundException('Equipment not found');
    return equipment;
  }

  async update(
    id: string,
    data: Partial<Equipment>,
    userId?: string,
  ): Promise<Equipment> {
    return this.equipmentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Equipment>,
    userId?: string,
  ): Promise<Equipment> {
    // Optionally use userId for audit/history
    // Only update provided fields, do not overwrite with undefined
    const updateData: Partial<Equipment> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.equipmentModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true },
    ).exec();
    if (!updated) throw new NotFoundException('Equipment not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const equipmentDoc = await this.equipmentModel.findOne({ _id: id });
    if (!equipmentDoc) throw new NotFoundException('Equipment not found');
    await (equipmentDoc as any).delete();
    return equipmentDoc;
  }

  async restore(id: string, userId?: string): Promise<Equipment> {
    const equipmentDoc = await this.equipmentModel.findOne({ _id: id });
    if (!equipmentDoc) throw new NotFoundException('Equipment not found');
    await (equipmentDoc as any).restore();
    return equipmentDoc;
  }

  async updateStatus(id: string, state: string, updatedBy: string) {
    const equipment = await this.equipmentModel.findOne({ _id: id });
    if (!equipment) throw new NotFoundException('Equipment not found');
    equipment.currentStatus = { state, updatedAt: new Date(), updatedBy };
    await equipment.save();
    return equipment.currentStatus;
  }

  async addUsageStatus(id: string, data: any) {
    const equipment = await this.equipmentModel.findOne({ _id: id });
    if (!equipment) throw new NotFoundException('Equipment not found');
    equipment.usageStatus = equipment.usageStatus || [];
    equipment.usageStatus.push({ ...data, updatedAt: new Date() });
    await equipment.save();
    return equipment.usageStatus;
  }

  async swapEquipment(id: string, data: any) {
    const equipment = await this.equipmentModel.findOne({ _id: id });
    if (!equipment) throw new NotFoundException('Equipment not found');
    equipment.swapHistory = equipment.swapHistory || [];
    equipment.swapHistory.push({ ...data, swappingDate: new Date() });
    await equipment.save();
    return equipment.swapHistory;
  }

  async filter(filterDto: any): Promise<Equipment[]> {
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
    let q = this.equipmentModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
