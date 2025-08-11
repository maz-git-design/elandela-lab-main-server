import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, ModuleSchema } from './module.schema';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { PermissionModule } from '../permission/permission.module';
import { Permission, PermissionSchema } from '../permission/permission.schema';

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Module.name, schema: ModuleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    PermissionModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
