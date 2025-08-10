import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cohort, CohortSchema } from './cohort.schema';
import { CohortService } from './cohort.service';
import { CohortController } from './cohort.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohort.name, schema: CohortSchema }]),
  ],
  controllers: [CohortController],
  providers: [CohortService],
  exports: [CohortService],
})
export class CohortModule {}
