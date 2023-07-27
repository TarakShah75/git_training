import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Jobs, JobsDocument } from './schemas/jobApplication.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomError, TypeExceptions } from 'src/common/helpers/exceptions';

@Injectable()
export class JobapplicationService {
  constructor(@InjectModel(Jobs.name) private JobsModel: Model<JobsDocument>) {}
  async create(createApplicationDto: CreateApplicationDto) {
    try {
      // Check duplicate user
      if (await this.getUserByEmail(createApplicationDto.email)) {
        throw TypeExceptions.UserAlreadyExists();
      }

      return await this.JobsModel.create(createApplicationDto);
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async findAll(noOfRecordOnEachPage: number, currentPageNumber: number) {
    const allData = await this.JobsModel.find();
    const result = await this.JobsModel.find()
      .lean()
      .skip(noOfRecordOnEachPage * (currentPageNumber - 1))
      .limit(noOfRecordOnEachPage);
    const data: any = {
      data: result,
      totalRecord: allData.length,
      currentPageNumber: currentPageNumber,
    };

    return data;
  }

  async searchAll(searchValue: string) {
    return await this.JobsModel.find({
      $or: [
        { name: { $regex: searchValue, $options: 'i' } },
        { email: { $regex: searchValue, $options: 'i' } },
      ],
    });
  }

  async findOne(jobId: string) {
    return await this.JobsModel.findOne({
      _id: jobId,
    }).lean();
  }

  async update(jobId: string, updateJobDto: UpdateJobDto) {
    try {
      return await this.JobsModel.updateOne({ _id: jobId }, updateJobDto);
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async remove(jobId: string) {
    try {
      return await this.JobsModel.deleteOne({ _id: jobId });
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.JobsModel.findOne({
      email: email,
    }).lean();
  }
}
