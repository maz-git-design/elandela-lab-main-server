import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, ModuleSchema } from './module.schema';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
