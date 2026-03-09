import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
  ) {}

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
      mustSetNewPassword: true, // Require user to set a new password after creation
    });
    const createdUser = await user.save();
    return createdUser;
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

  async setPassword(user: any, oldPassword: string, newPassword: string) {
    console.log('oldPassword:', oldPassword);
    if (!user) throw new UnauthorizedException('User not found in session');
    const dbUser = await this.userModel.findById(user._id).exec();
    if (!dbUser) throw new UnauthorizedException('User not found');
    const isMatch = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');
    dbUser.password = await bcrypt.hash(newPassword, 10);
    dbUser.mustSetNewPassword = false;
    await dbUser.save();
    return dbUser.toObject ? dbUser.toObject() : dbUser;
  }

  // Used by LocalStrategy for Passport local authentication
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ username, isDeleted: false })
      .exec();
    if (!user || !user.password) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // This login method expects loginDto as before, and uses LocalAuthGuard for validation
  async login(loginDto: LoginDto) {
    // LocalAuthGuard should have validated the user and attached it to req.user in the controller
    // Here, we find the user by username (for consistency with DTO usage)
    const user = await this.userModel
      .findOne({ username: loginDto.username, isDeleted: false })
      .exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
