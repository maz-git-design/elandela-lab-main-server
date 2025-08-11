import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './department.schema';
import { CreateDepartmentDto } from './department.dto';
import { UpdateDepartmentDto } from './update-department.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
    userId?: string,
  ): Promise<Department> {
    await validateOrReject(createDepartmentDto);
    return this.departmentModel.create(createDepartmentDto);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    userId?: string,
  ): Promise<Department> {
    await validateOrReject(updateDepartmentDto);
    return this.departmentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateDepartmentDto, {
        new: true,
      })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Department>,
    userId?: string,
  ): Promise<Department> {
    const dto = plainToInstance(CreateDepartmentDto, data);
    await validateOrReject(dto as object);
    const updateData: Partial<Department> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.departmentModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Department not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const departmentDoc = await this.departmentModel.findOne({ _id: id });
    if (!departmentDoc) throw new NotFoundException('Department not found');
    await (departmentDoc as any).delete();
    return departmentDoc;
  }

  async restore(id: string, userId?: string): Promise<Department> {
    const departmentDoc = await this.departmentModel.findOne({ _id: id });
    if (!departmentDoc) throw new NotFoundException('Department not found');
    await (departmentDoc as any).restore();
    return departmentDoc;
  }

  async filter(filterDto: any): Promise<Department[]> {
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
    let q = this.departmentModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
