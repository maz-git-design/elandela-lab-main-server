import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';

import { RolesActionsGuard } from './modules/auth/roles-actions.guard';
import { PermissionModule } from './modules/permission/permission.module';
import { ModuleModule } from './modules/module/module.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { EquipmentCategoryModule } from './modules/equipmentCategory/equipmentCategory.module';
import { LabModule } from './modules/lab/lab.module';
import { DepartmentModule } from './modules/department/department.module';
import { AcademicYearModule } from './modules/academicYear/academicYear.module';
import { ActivityModule } from './modules/activity/activity.module';
import { CohortModule } from './modules/cohort/cohort.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/elandela-lab'),
    UserModule,
    RoleModule,
    AuthModule,
    PermissionModule,
    ModuleModule,
    EquipmentModule,
    EquipmentCategoryModule,
    LabModule,
    DepartmentModule,
    AcademicYearModule,
    ActivityModule,
    CohortModule,
    ReservationModule,
    AttendanceModule,
    // ...other modules will be added here
  ],
  controllers: [AppController],
  providers: [AppService, RolesActionsGuard],
})
export class AppModule {}
