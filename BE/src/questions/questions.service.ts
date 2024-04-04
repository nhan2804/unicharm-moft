import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Question, QuestionDocument } from './entities/questions.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService extends AbstractService<Question> {
  constructor(
    @InjectModel(Question.name)
    readonly model: Model<QuestionDocument>,
  ) {
    super(model);
  }
}
