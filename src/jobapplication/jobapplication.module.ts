import { Module } from '@nestjs/common';
import { JobapplicationController } from './jobapplication.controller';
import { JobapplicationService } from './jobapplication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schemas/jobApplication.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
  ],
  controllers: [JobapplicationController],
  providers: [JobapplicationService],
})
export class JobapplicationModule {}
