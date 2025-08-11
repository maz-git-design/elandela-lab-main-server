import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
  ) {}

  async changeStatus(id: string, state: string, updatedBy: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    user.status = {
      state,
      updatedAt: new Date(),
      updatedBy,
    };
    user.statusHistory = user.statusHistory || [];
    user.statusHistory.push({
      state,
      updatedAt: new Date(),
      updatedBy,
    });
    await user.save();
    return user;
  }

  async reinitPassword(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    const defaultPassword = 'ChangeMe123!';
    user.password = await bcrypt.hash(defaultPassword, 10);
    await user.save();
    return { user, defaultPassword };
  }

  async create(createUserDto: CreateUserDto, userId?: string): Promise<User> {
    // Validate input using DTO

    if (!createUserDto.password) {
      createUserDto.password = await bcrypt.hash('ChangeMe123!', 10);
    } else {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }
    return this.userModel.create(createUserDto);
  }

  async findAll(filter: any = {}): Promise<User[]> {
    const query: any = { isDeleted: false };
    if (filter.role) query.roles = filter.role;
    if (filter.status) query['status.state'] = filter.status;
    if (filter.cohortId) query.cohortId = filter.cohortId;
    return this.userModel.find(query).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userId?: string,
  ): Promise<User> {
    await validateOrReject(updateUserDto);
    return this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateUserDto, {
        new: true,
      })
      .exec();
  }

  async partialUpdate(
    id: string,
    data: Partial<User>,
    userId?: string,
  ): Promise<User> {
    // Validate input using DTO
    const dto = plainToInstance(CreateUserDto, data);
    await validateOrReject(dto);
    const updateData: Partial<User> = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    const updated = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const userDoc = await this.userModel.findOne({ _id: id });
    if (!userDoc) throw new NotFoundException('User not found');
    await (userDoc as any).delete();
    return userDoc;
  }

  async restore(id: string, userId?: string): Promise<User> {
    const userDoc = await this.userModel.findOne({ _id: id });
    if (!userDoc) throw new NotFoundException('User not found');
    await (userDoc as any).restore();
    return userDoc;
  }

  async updateRoles(id: string, roles: string[]) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    user.roles = roles.map((r) => new Types.ObjectId(r));
    await user.save();
    return user;
  }

  async updateCustomPermissions(id: string, customPermissions: string[]) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    user.customPermissions = customPermissions.map(
      (p) => new Types.ObjectId(p),
    );
    await user.save();
    return user;
  }

  async uploadFaceFingerprint(id: string, data: any) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    user.faceFingerprint = {
      ...data,
      registeredAt: user.faceFingerprint?.registeredAt || new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    await user.save();
    return user.faceFingerprint;
  }

  async getFaceFingerprint(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    if (!user.faceFingerprint) return null;
    const { encodingVector, ...meta } = user.faceFingerprint;
    return meta;
  }

  async requestPasswordReset(id: string, email: string) {
    // TODO: Implement email sending and token generation
    // For now, just return a mock response
    return { message: `Password reset link sent to ${email}` };
  }

  async resetPassword(id: string, token: string, newPassword: string) {
    // TODO: Validate token
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { user };
  }

  async filter(filterDto: any): Promise<User[]> {
    const query: any = { isDeleted: false };
    if (filterDto.fromDate || filterDto.toDate) {
      query.createdAt = {};
      if (filterDto.fromDate)
        query.createdAt.$gte = new Date(filterDto.fromDate);
      if (filterDto.toDate) query.createdAt.$lte = new Date(filterDto.toDate);
    }
    if (filterDto.status) {
      query['status.state'] = filterDto.status;
    }
    for (const key of Object.keys(filterDto)) {
      if (!['fromDate', 'toDate', 'status', 'sort'].includes(key)) {
        query[key] = filterDto[key];
      }
    }
    let q = this.userModel.find(query);
    if (filterDto.sort) {
      q = q.sort(filterDto.sort);
    }
    return q.exec();
  }
}
