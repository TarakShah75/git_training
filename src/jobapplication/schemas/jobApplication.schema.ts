import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema({ collection: 'jobs', timestamps: true, versionKey: false })
export class Jobs {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  gender: string;
  @Prop({ required: true })
  contactNumber: string;

  @Prop()
  sscMarks: number;
  @Prop()
  sscBoard: string;
  @Prop()
  hscMarks: number;
  @Prop()
  hscBoard: string;
  @Prop()
  graduationCGPA: number;
  @Prop()
  graduationUniversity: string;

  @Prop()
  masterDegreeCGPA: number;
  @Prop()
  masterDegreeUniversity: string;

  // @Prop()
  // workExperience: boolean;
  @Prop()
  workExperienceDetails: [
    {
      company: string;
      designation: string;
      from: string;
      to: string;
    },
  ];

  @Prop()
  knownLanguage: Array<any>;

  @Prop()
  technialExperiance: string;

  @Prop()
  technicalDetails: Array<any>;

  @Prop({ required: true })
  preferredLocation: string;

  @Prop({ required: true })
  expectedCTC: number;

  @Prop()
  currentCTC: number;
  @Prop()
  noticePeriod: number;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
