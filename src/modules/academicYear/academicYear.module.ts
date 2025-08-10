import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicYear, AcademicYearSchema } from './academicYear.schema';
import { AcademicYearService } from './academicYear.service';
import { AcademicYearController } from './academicYear.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcademicYear.name, schema: AcademicYearSchema },
    ]),
  ],
  controllers: [AcademicYearController],
  providers: [AcademicYearService],
  exports: [AcademicYearService],
})
export class AcademicYearModule {}
