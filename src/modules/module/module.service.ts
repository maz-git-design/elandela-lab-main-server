import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';
import {
  Permission,
  PermissionDocument,
} from '../permission/permission.schema';
import { CreateModuleDto } from './module.dto';
import { UpdateModuleDto } from './update-module.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Permission.name)
    readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(
    createModuleDto: CreateModuleDto,
    userId?: string,
  ): Promise<Module> {
    await validateOrReject(createModuleDto);
    // Permission creation logic remains
    const moduleDoc = await this.moduleModel.create(createModuleDto);
    if (
      createModuleDto.availableActions &&
      Array.isArray(createModuleDto.availableActions)
    ) {
      for (const action of createModuleDto.availableActions) {
        const permissionName = `${action}_${moduleDoc.name}`;
        await this.permissionModel.create({
          name: permissionName,
          description: `Allows user to ${action} on ${moduleDoc.name}`,
          moduleId: moduleDoc._id,
          actions: [action],
          createdBy: userId,
        });
      }
    }
    return moduleDoc;
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
    userId?: string,
  ): Promise<Module> {
    await validateOrReject(updateModuleDto);
    return this.moduleModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateModuleDto, {
        new: true,
      })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Module>,
    userId?: string,
  ): Promise<Module> {
    const dto = plainToInstance(CreateModuleDto, data);
    await validateOrReject(dto as object);
    const updateData: Partial<Module> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.moduleModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Module not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const moduleDoc = await this.moduleModel.findOne({ _id: id });
    if (!moduleDoc) throw new NotFoundException('Module not found');
    // Optionally use userId for audit/history
    // Example: await this.auditService.logDelete('Module', id, userId);
    await (moduleDoc as any).delete();
    return moduleDoc;
  }

  async restore(id: string, userId?: string): Promise<Module> {
    const moduleDoc = await this.moduleModel.findOne({ _id: id });
    if (!moduleDoc) throw new NotFoundException('Module not found');
    // Optionally use userId for audit/history
    // Example: await this.auditService.logRestore('Module', id, userId);
    await (moduleDoc as any).restore();
    return moduleDoc;
  }

  async filter(filterDto: any): Promise<Module[]> {
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
    // Add other relevant fields from filterDto
    for (const key of Object.keys(filterDto)) {
      if (!['fromDate', 'toDate', 'status', 'sort'].includes(key)) {
        query[key] = filterDto[key];
      }
    }
    let q = this.moduleModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
