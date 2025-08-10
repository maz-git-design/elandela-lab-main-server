import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) readonly activityModel: Model<ActivityDocument>,
  ) {}

  async create(data: Partial<Activity>, userId?: string): Promise<Activity> {
    // Optionally use userId for audit/history
    return this.activityModel.create(data);
  }

  async findAll(): Promise<Activity[]> {
    return this.activityModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(
    id: string,
    data: Partial<Activity>,
    userId?: string,
  ): Promise<Activity> {
    return this.activityModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async softDelete(id: string, userId?: string) {
    const activityDoc = await this.activityModel.findOne({ _id: id });
    if (!activityDoc) throw new NotFoundException('Activity not found');
    await (activityDoc as any).delete();
    return activityDoc;
  }

  async restore(id: string, userId?: string): Promise<Activity> {
    const activityDoc = await this.activityModel.findOne({ _id: id });
    if (!activityDoc) throw new NotFoundException('Activity not found');
    await (activityDoc as any).restore();
    return activityDoc;
  }

  async filter(filterDto: any): Promise<Activity[]> {
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
    let q = this.activityModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
