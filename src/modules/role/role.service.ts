import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { CreateRoleDto } from './role.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, userId?: string): Promise<Role> {
    await validateOrReject(createRoleDto);
    return this.roleModel.create(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(
    id: string,
    data: Partial<Role>,
    userId?: string,
  ): Promise<Role> {
    const dto = plainToInstance(CreateRoleDto, data);
    await validateOrReject(dto as object);
    return this.roleModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Role>,
    userId?: string,
  ): Promise<Role> {
    const dto = plainToInstance(CreateRoleDto, data);
    await validateOrReject(dto as object);
    const updateData: Partial<Role> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.roleModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Role not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const roleDoc = await this.roleModel.findOne({ _id: id });
    if (!roleDoc) throw new NotFoundException('Role not found');
    await (roleDoc as any).delete();
    return roleDoc;
  }

  async restore(id: string, userId?: string): Promise<Role> {
    const roleDoc = await this.roleModel.findOne({ _id: id });
    if (!roleDoc) throw new NotFoundException('Role not found');
    await (roleDoc as any).restore();
    return roleDoc;
  }

  async filter(filterDto: any): Promise<Role[]> {
    const query: any = { isDeleted: false };
    if (filterDto.fromDate || filterDto.toDate) {
      query.createdAt = {};
      if (filterDto.fromDate)
        query.createdAt.$gte = new Date(filterDto.fromDate);
      if (filterDto.toDate) query.createdAt.$lte = new Date(filterDto.toDate);
    }
    for (const key of Object.keys(filterDto)) {
      if (!['fromDate', 'toDate', 'sort'].includes(key)) {
        query[key] = filterDto[key];
      }
    }
    let q = this.roleModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }

  async advancedFilter(filterDto: any): Promise<Role[]> {
    const query: any = { isDeleted: false };
    // Date range
    if (filterDto.fromDate || filterDto.toDate) {
      query.createdAt = {};
      if (filterDto.fromDate)
        query.createdAt.$gte = new Date(filterDto.fromDate);
      if (filterDto.toDate) query.createdAt.$lte = new Date(filterDto.toDate);
    }
    // Status
    if (filterDto.status) {
      query.status = filterDto.status;
    }
    // Other fields
    for (const key of Object.keys(filterDto)) {
      if (
        ![
          'fromDate',
          'toDate',
          'status',
          'sort',
          'fields',
          'limit',
          'skip',
        ].includes(key)
      ) {
        query[key] = filterDto[key];
      }
    }
    let q = this.roleModel.find(query);
    // Field selection
    if (filterDto.fields) {
      q = q.select(filterDto.fields);
    }
    // Sorting
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    // Pagination
    if (filterDto.skip) {
      q = q.skip(Number(filterDto.skip));
    }
    if (filterDto.limit) {
      q = q.limit(Number(filterDto.limit));
    }
    return q.exec();
  }
}
