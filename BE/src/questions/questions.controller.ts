import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/questions.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
import pickRandomQuestion from './helpers/pickRandomQuestion';
import { UsersService } from 'src/users/users.service';
import { date2Str } from 'src/checkin/checkin.controller';
import { Public } from 'src/auth/guards/public';
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly userServices: UsersService,
  ) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }
  // @Public()
  // @Get('/set')
  // get(@Body() createQuestionDto: CreateQuestionDto) {
  //   return this.questionsService.update(
  //     {},
  //     {
  //       $set: { typeQuestion: 'WORK' },
  //     },
  //   );
  // }
  @Post('bulk/create')
  createBulk(@Body() createQuestionDto: CreateQuestionDto[]) {
    return this.questionsService.createArray(createQuestionDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Question & SortPaginate) | any,
  ) {
    return this.questionsService.findAll(query, undefined, undefined, { x: 1 });
  }
  @Get('rating')
  findAllForRating(
    @Query()
    query: (Question & SortPaginate) | any,
  ) {
    return this.questionsService.findAll(
      { ...query, typeQuestion: 'RATING', status: 'ACTIVE' },
      undefined,
      undefined,
      { x: 1 },
    );
  }
  @Get('policy')
  findAllForPolicy(
    @Query()
    query: (Question & SortPaginate) | any,
  ) {
    return this.questionsService.findAll(
      { ...query, typeQuestion: 'POLICY', status: 'ACTIVE' },
      undefined,
      undefined,
      { x: 1 },
    );
  }
  @Get('staff')
  async findAllForStaff(
    @UserLoggin()
    u: UserDocument,
  ) {
    const user = await this.userServices.findOne({
      _id: new Types.ObjectId(u?._id),
    });

    let shouldRandom = true;
    const keyNow = date2Str(new Date());
    if (user?.questionOption?.date) {
      const check = date2Str(user?.questionOption?.date) === keyNow;
      if (check) {
        shouldRandom = false;
      }
    }

    const counts = {
      PRODUCT_KNOWLEDGE: 5,
      WORK_QUESTION: 5,
    };

    const question = await this.questionsService.findAll({
      typeQuestion: 'WORK',
      status: 'ACTIVE',
    });
    if (shouldRandom) {
      const randomQ = question
        ?.sort(() => Math.random() - Math.random())
        ?.slice(0, 5);
      // pickRandomQuestion(question, counts);
      if (randomQ.length > 0) {
        user.questionOption = {
          question: randomQ?.map((e) => e?._id)?.toString(),
          date: new Date(),
        };
        user.save();
      }

      return randomQ;
    }
    return question?.filter((e) => {
      return user.questionOption?.question?.includes(e?._id?.toString());
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.questionsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateOne(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.questionsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
