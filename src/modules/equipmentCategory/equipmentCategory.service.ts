import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EquipmentCategory,
  EquipmentCategoryDocument,
} from './equipmentCategory.schema';
import { CreateEquipmentCategoryDto } from './equipmentCategory.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EquipmentCategoryService {
  constructor(
    @InjectModel(EquipmentCategory.name)
    readonly equipmentCategoryModel: Model<EquipmentCategoryDocument>,
  ) {}

  async create(
    createEquipmentCategoryDto: CreateEquipmentCategoryDto,
    userId?: string,
  ): Promise<EquipmentCategory> {
    await validateOrReject(createEquipmentCategoryDto);
    return this.equipmentCategoryModel.create(createEquipmentCategoryDto);
  }

  async findAll(): Promise<EquipmentCategory[]> {
    return this.equipmentCategoryModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<EquipmentCategory> {
    const category = await this.equipmentCategoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!category) throw new NotFoundException('Equipment category not found');
    return category;
  }

  async update(
    id: string,
    data: Partial<EquipmentCategory>,
    userId?: string,
  ): Promise<EquipmentCategory> {
    const dto = plainToInstance(CreateEquipmentCategoryDto, data);
    await validateOrReject(dto as object);
    return this.equipmentCategoryModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<EquipmentCategory>,
    userId?: string,
  ): Promise<EquipmentCategory> {
    const dto = plainToInstance(CreateEquipmentCategoryDto, data);
    await validateOrReject(dto as object);
    const updateData: Partial<EquipmentCategory> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.equipmentCategoryModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('EquipmentCategory not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const equipmentCategoryDoc = await this.equipmentCategoryModel.findOne({
      _id: id,
    });
    if (!equipmentCategoryDoc)
      throw new NotFoundException('EquipmentCategory not found');
    await (equipmentCategoryDoc as any).delete();
    return equipmentCategoryDoc;
  }

  async restore(id: string, userId?: string): Promise<EquipmentCategory> {
    const equipmentCategoryDoc = await this.equipmentCategoryModel.findOne({
      _id: id,
    });
    if (!equipmentCategoryDoc)
      throw new NotFoundException('EquipmentCategory not found');
    await (equipmentCategoryDoc as any).restore();
    return equipmentCategoryDoc;
  }

  async filter(filterDto: any): Promise<EquipmentCategory[]> {
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
    let q = this.equipmentCategoryModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
