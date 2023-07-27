import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JobapplicationService } from './jobapplication.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  APPLICATION_INSERTED,
  JOBS_APPLICATION_DELETED,
  JOBS_APPLICATION_LISTED,
  JOBS_APPLICATION_SEARCH,
  JOBS_APPLICATION_UPDATED,
} from 'src/common/constants/application.constant';
import { Public } from 'src/security/auth/auth.decorator';
import { CreateApplicationDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobapplication')
export class JobapplicationController {
  constructor(private jobApplicationService: JobapplicationService) {}

  @Post('create')
  @ResponseMessage(APPLICATION_INSERTED)
  @Public()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.jobApplicationService.create(createApplicationDto);
  }

  @Post('getAll')
  @ResponseMessage(JOBS_APPLICATION_LISTED)
  findAll(@Body() data: any) {
    return this.jobApplicationService.findAll(
      data.noOfRecordOnEachPage,
      data.currentPageNumber,
    );
  }

  @Post('search')
  @ResponseMessage(JOBS_APPLICATION_SEARCH)
  search(@Body() data: any) {
    return this.jobApplicationService.searchAll(data.searchValue);
  }

  @Get('get/:id')
  @ResponseMessage(JOBS_APPLICATION_LISTED)
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(id);
  }

  @Patch('update/:id')
  @ResponseMessage(JOBS_APPLICATION_UPDATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobApplicationService.update(id, updateJobDto);
  }

  @Delete('delete/:id')
  @ResponseMessage(JOBS_APPLICATION_DELETED)
  remove(@Param('id') id: string) {
    return this.jobApplicationService.remove(id);
  }
}
