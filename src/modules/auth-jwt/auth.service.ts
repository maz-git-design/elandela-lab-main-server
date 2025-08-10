import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
    readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ username, isDeleted: false })
      .exec();
    if (!user || !user.password) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: User | any) {
    const payload = {
      sub: user._id?.toString() || user.id?.toString(),
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = new this.userModel(data);
    await user.save();
    return this.login(user.toObject());
  }
}
