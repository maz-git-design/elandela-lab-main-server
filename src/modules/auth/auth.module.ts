import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, CurrentUserInterceptor, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
