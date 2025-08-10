import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lab, LabSchema } from './lab.schema';
import { LabService } from './lab.service';
import { LabController } from './lab.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lab.name, schema: LabSchema }])],
  controllers: [LabController],
  providers: [LabService],
  exports: [LabService],
})
export class LabModule {}
