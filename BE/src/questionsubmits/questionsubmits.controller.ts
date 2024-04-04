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
import { QuestionsubmitsService } from './questionsubmits.service';
import { CreateQuestionsubmitDto } from './dto/create-questionsubmit.dto';
import { UpdateQuestionsubmitDto } from './dto/update-questionsubmit.dto';
import { Questionsubmit } from './entities/questionsubmits.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
@Controller('question-submit')
export class QuestionsubmitsController {
  constructor(
    private readonly questionsubmitsService: QuestionsubmitsService,
  ) {}

  @Post()
  create(
    @Body() createQuestionsubmitDto: CreateQuestionsubmitDto,
    @UserLoggin() user: UserDocument,
  ) {
    return this.questionsubmitsService.create({
      ...createQuestionsubmitDto,
      creator: new Types.ObjectId(user?._id),
      ownerId: new Types.ObjectId(user?._id),
    });
  }
  @Post('bulk/create')
  createBulk(@Body() createQuestionsubmitDto: CreateQuestionsubmitDto[]) {
    return this.questionsubmitsService.createArray(createQuestionsubmitDto);
  }
  @Get('/today')
  async today(@UserLoggin() u: UserDocument) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const checkin = await this.questionsubmitsService.findOne({
      ownerId: new Types.ObjectId(u?._id),

      createdAt: { $gte: startOfToday },
    });
    // if (checkin?.timeCheckOut) {
    //   return null;
    // }
    return checkin;
  }
  @Get()
  findAll(
    @Query()
    query: (Questionsubmit & SortPaginate) | any,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),

      // ...(query?.ownerId && {
      //   ownerId: new Types.ObjectId(query?.ownerId),
      // }),
      ...(Number(query?.startTime) &&
        Number(query?.endTime) && {
          createdAt: {
            $gte: new Date(Number(query?.startTime)),
            $lte: new Date(Number(query?.endTime)),
          },
        }),
    };
    return this.questionsubmitsService
      .findAll(
        queries,
        {},
        sortObj,
        // query?.page,
        // query?.perPage,
      )
      .populate('owner');
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.questionsubmitsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionsubmitDto: UpdateQuestionsubmitDto,
  ) {
    return this.questionsubmitsService.updateOne(id, updateQuestionsubmitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsubmitsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.questionsubmitsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
