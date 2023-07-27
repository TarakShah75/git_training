import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  sscMarks: number;
  @ApiProperty()
  sscBoard: string;

  @ApiProperty()
  hscMarks: number;
  @ApiProperty()
  hscBoard: string;

  @ApiProperty()
  graduationCGPA: number;
  @ApiProperty()
  graduationUniversity: string;

  @ApiProperty()
  masterDegreeCGPA: number;
  @ApiProperty()
  masterDegreeUniversity: string;

  @ApiProperty()
  workExperience: boolean;
  @ApiProperty()
  workExperienceDetails: Array<any>;

  @ApiProperty()
  knownLanguage: Array<any>;

  @ApiProperty()
  technialExperiance: Boolean;
  @ApiProperty()
  technicalDetails: Array<any>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  preferredLocation: string;

  @ApiProperty()
  expectedCTC: number;
  @ApiProperty()
  currentCTC: number;
  @ApiProperty()
  noticePeriod: number;
}
