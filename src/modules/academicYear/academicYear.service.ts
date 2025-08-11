import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Model } from 'mongoose';
import { AcademicYear, AcademicYearDocument } from './academicYear.schema';
import { CreateAcademicYearDto } from './academicYear.dto';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectModel(AcademicYear.name)
    readonly academicYearModel: Model<AcademicYearDocument>,
  ) {}

  async create(
    createAcademicYearDto: CreateAcademicYearDto,
    userId?: string,
  ): Promise<AcademicYear> {
    await validateOrReject(createAcademicYearDto);
    return this.academicYearModel.create(createAcademicYearDto);
  }

  async findAll(): Promise<AcademicYear[]> {
    return this.academicYearModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<AcademicYear> {
    const year = await this.academicYearModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!year) throw new NotFoundException('Academic year not found');
    return year;
  }

  async update(
    id: string,
    data: Partial<AcademicYear>,
    userId?: string,
  ): Promise<AcademicYear> {
    const dto = plainToInstance(CreateAcademicYearDto, data);
    await validateOrReject(dto);
    return this.academicYearModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<AcademicYear>,
    userId?: string,
  ): Promise<AcademicYear> {
    const dto = plainToInstance(CreateAcademicYearDto, data);
    await validateOrReject(dto);
    const updateData: Partial<AcademicYear> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.academicYearModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('AcademicYear not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const academicYearDoc = await this.academicYearModel.findOne({ _id: id });
    if (!academicYearDoc) throw new NotFoundException('AcademicYear not found');
    await (academicYearDoc as any).delete();
    return academicYearDoc;
  }

  async restore(id: string, userId?: string): Promise<AcademicYear> {
    const academicYearDoc = await this.academicYearModel.findOne({ _id: id });
    if (!academicYearDoc) throw new NotFoundException('AcademicYear not found');
    await (academicYearDoc as any).restore();
    return academicYearDoc;
  }

  async filter(filterDto: any): Promise<AcademicYear[]> {
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
    let q = this.academicYearModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
