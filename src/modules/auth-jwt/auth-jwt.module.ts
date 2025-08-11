import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { AuthJwtController } from './auth-jwt.controller';
import { AuthJwtService } from './auth-jwt.service';
import { RolesActionsGuard } from '../auth/roles-actions.guard';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthJwtController],
  providers: [AuthJwtService, RolesActionsGuard],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
