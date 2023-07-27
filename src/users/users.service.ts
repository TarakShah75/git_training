import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { LoginDto } from 'src/common/dto/common.dto';
import { Users, UsersDocument } from 'src/users/schemas/user.schema';
import {
  AuthExceptions,
  CustomError,
  TypeExceptions,
} from 'src/common/helpers/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private UsersModel: Model<UsersDocument>,
    private myLogger: LoggerService,
    private configService: ConfigService,
  ) {
    // Due to transient scope, UsersService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext(UsersService.name);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // Check duplicate user
      if (await this.getUserByEmail(createUserDto.email)) {
        throw TypeExceptions.UserAlreadyExists();
      }

      return await this.UsersModel.create(createUserDto);
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async findAll() {
    return await this.UsersModel.find().lean();
  }

  async findOne(userId: string) {
    return await this.UsersModel.findOne({
      _id: userId,
    }).lean();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.UsersModel.updateOne({ _id: userId }, updateUserDto);
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async remove(userId: string) {
    try {
      return await this.UsersModel.deleteOne({ _id: userId });
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async createInitialUser(): Promise<void> {
    try {
      const user = await this.getUserByEmail(
        this.configService.get('database.initialUser.email'),
      );

      if (user) {
        this.myLogger.customLog('Initial user already loaded.');
      } else {
        const params: CreateUserDto = {
          firstName: this.configService.get('database.initialUser.firstName'),
          lastName: this.configService.get('database.initialUser.lastName'),
          gender: this.configService.get('database.initialUser.gender'),
          email: this.configService.get('database.initialUser.email'),
          password: '',
          isActive: true,
        };

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(
          this.configService.get('database.initialUser.password'),
          salt,
        );

        params.password = hash;

        await this.UsersModel.create(params);
        this.myLogger.log('Initial user loaded successfully.');
      }
    } catch (error) {
      this.myLogger.error(error?.message || error);
      throw CustomError.UnknownError(
        error?.message || 'Something went wrong, Please try again later!',
      );
    }
  }

  async login(params: LoginDto): Promise<any> {
    try {
      const user = await this.UsersModel.findOne({
        email: params.userName,
      }).lean();

      if (!user) {
        throw AuthExceptions.AccountNotexist();
      }

      if (!bcrypt.compareSync(params.password, user.password)) {
        throw AuthExceptions.InvalidIdPassword();
      }

      if (!user.isActive) {
        throw AuthExceptions.AccountNotActive();
      }

      const { password, __v, ...response } = user;

      return response;
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.UsersModel.findOne({
      email: email,
    }).lean();
  }
}
