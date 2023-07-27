import { PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateApplicationDto) {}
