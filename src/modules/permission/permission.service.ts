import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from './permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(
    data: Partial<Permission>,
    userId?: string,
  ): Promise<Permission> {
    // Optionally use userId for audit/history
    return this.permissionModel.create(data);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(
    id: string,
    data: Partial<Permission>,
    userId?: string,
  ): Promise<Permission> {
    return this.permissionModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async softDelete(id: string, userId?: string) {
    const permissionDoc = await this.permissionModel.findOne({ _id: id });
    if (!permissionDoc) throw new NotFoundException('Permission not found');
    await (permissionDoc as any).delete();
    return permissionDoc;
  }

  async restore(id: string, userId?: string): Promise<Permission> {
    const permissionDoc = await this.permissionModel.findOne({ _id: id });
    if (!permissionDoc) throw new NotFoundException('Permission not found');
    await (permissionDoc as any).restore();
    return permissionDoc;
  }

  async filter(filterDto: any): Promise<Permission[]> {
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
    let q = this.permissionModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
