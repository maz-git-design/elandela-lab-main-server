import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../user/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

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

  async validateSignup({
    email,
    firstName,
    lastName,
  }: {
    email?: string;
    firstName: string;
    lastName: string;
  }) {
    if (email) {
      const emailExists = await this.userModel
        .findOne({ email, isDeleted: false })
        .exec();
      if (emailExists) {
        throw new BadRequestException('Email is already in use');
      }
    }
    const nameExists = await this.userModel
      .findOne({ firstName, lastName, isDeleted: false })
      .exec();
    if (nameExists) {
      throw new BadRequestException(
        'A user with this first name and last name already exists',
      );
    }
  }

  async generateLoginResponse(user: User | any) {
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

  async signup(signupDto: SignupDto) {
    const { firstName, lastName, password, email } = signupDto;
    await this.validateSignup({ email, firstName, lastName });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      username: email || `${firstName}.${lastName}`,
    });
    await user.save();
    return this.generateLoginResponse(user.toObject());
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    // If user is a Mongoose document, convert to plain object
    const plainUser = (user as any).toObject ? (user as any).toObject() : user;
    return this.generateLoginResponse(plainUser);
  }

  async resetPassword(username: string, newPassword: string) {
    const user = await this.userModel
      .findOne({ username, isDeleted: false })
      .exec();
    if (!user) throw new UnauthorizedException('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password reset successful' };
  }
}
