import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../auth/local.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
