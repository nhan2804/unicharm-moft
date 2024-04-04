import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Questionsubmit, QuestionsubmitDocument } from './entities/questionsubmits.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsubmitsService extends AbstractService<Questionsubmit> {
  constructor(
    @InjectModel(Questionsubmit.name)
    readonly model: Model<QuestionsubmitDocument>,
  ) {
    super(model);
  }
}
