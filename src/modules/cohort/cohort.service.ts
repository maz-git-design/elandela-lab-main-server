import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cohort, CohortDocument } from './cohort.schema';
import { CreateCohortDto } from './cohort.dto';
import { UpdateCohortDto } from './update-cohort.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class CohortService {
  constructor(
    @InjectModel(Cohort.name) readonly cohortModel: Model<CohortDocument>,
  ) {}

  async create(
    createCohortDto: CreateCohortDto,
    userId?: string,
  ): Promise<Cohort> {
    await validateOrReject(createCohortDto);
    return this.cohortModel.create(createCohortDto);
  }

  async findAll(): Promise<Cohort[]> {
    return this.cohortModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Cohort> {
    const cohort = await this.cohortModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!cohort) throw new NotFoundException('Cohort not found');
    return cohort;
  }

  async update(
    id: string,
    updateCohortDto: UpdateCohortDto,
    userId?: string,
  ): Promise<Cohort> {
    await validateOrReject(updateCohortDto);
    return this.cohortModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateCohortDto, {
        new: true,
      })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<Cohort>,
    userId?: string,
  ): Promise<Cohort> {
    const dto = plainToInstance(CreateCohortDto, data);
    await validateOrReject(dto as object);
    const updateData: Partial<Cohort> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.cohortModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Cohort not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const cohortDoc = await this.cohortModel.findOne({ _id: id });
    if (!cohortDoc) throw new NotFoundException('Cohort not found');
    await (cohortDoc as any).delete();
    return cohortDoc;
  }

  async restore(id: string, userId?: string): Promise<Cohort> {
    const cohortDoc = await this.cohortModel.findOne({ _id: id });
    if (!cohortDoc) throw new NotFoundException('Cohort not found');
    await (cohortDoc as any).restore();
    return cohortDoc;
  }

  async filter(filterDto: any): Promise<Cohort[]> {
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
    let q = this.cohortModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
