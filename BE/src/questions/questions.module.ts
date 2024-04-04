import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/questions.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    UsersModule,
  ],
})
export class QuestionsModule {}
