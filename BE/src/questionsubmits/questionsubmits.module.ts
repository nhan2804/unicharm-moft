import { Module } from '@nestjs/common';
import { QuestionsubmitsService } from './questionsubmits.service';
import { QuestionsubmitsController } from './questionsubmits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Questionsubmit, QuestionsubmitSchema } from './entities/questionsubmits.entity';

@Module({
  controllers: [QuestionsubmitsController],
  providers: [QuestionsubmitsService],
  imports: [
    MongooseModule.forFeature([{ name: Questionsubmit.name, schema: QuestionsubmitSchema }]),
  ],
})
export class QuestionsubmitsModule {}
