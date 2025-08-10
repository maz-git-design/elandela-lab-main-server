import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cohort, CohortDocument } from './cohort.schema';

@Injectable()
export class CohortService {
  constructor(
    @InjectModel(Cohort.name) readonly cohortModel: Model<CohortDocument>,
  ) {}

  async create(data: Partial<Cohort>, userId?: string): Promise<Cohort> {
    // Optionally use userId for audit/history
    return this.cohortModel.create(data);
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
    data: Partial<Cohort>,
    userId?: string,
  ): Promise<Cohort> {
    return this.cohortModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
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
