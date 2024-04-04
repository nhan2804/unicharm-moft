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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/ratings.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(
    @Body() createRatingDto: CreateRatingDto & { _id: string },
    @UserLoggin() u: UserDocument,
  ) {
    if (createRatingDto?._id) {
      return this.ratingsService.updateOne(
        createRatingDto?._id,
        createRatingDto,
      );
    } else {
      //
      return this.ratingsService.create({
        ...createRatingDto,
        creatorId: new Types.ObjectId(u?._id),
      });
    }
  }
  @Post('bulk/create')
  createBulk(@Body() createRatingDto: CreateRatingDto[]) {
    return this.ratingsService.createArray(createRatingDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Rating & SortPaginate) | any,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),

      ...(query?.storeId && {
        storeId: new Types.ObjectId(query?.storeId),
      }),
      ...(Number(query?.startTime) &&
        Number(query?.endTime) && {
          createdAt: {
            $gte: new Date(Number(query?.startTime)),
            $lte: new Date(Number(query?.endTime)),
          },
        }),
    };
    return this.ratingsService
      .findAll(queries)
      .populate('store owner user shift department');
  }
  @Get('today')
  ratingToday(
    @Query() query: (Rating & SortPaginate) | any,
    @UserLoggin() u: UserDocument,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.ratingsService.findOne({
      storeId: new Types.ObjectId(query?.storeId),
      shiftId: new Types.ObjectId(query?.shiftId),
      createdAt: { $gte: startOfToday },
      userId: new Types.ObjectId(query?.userId),
      checkinId: new Types.ObjectId(query?.checkinId),
      creatorId: new Types.ObjectId(u?._id),
      type: query?.type,
    });
  }

  @Get('policy/overview')
  findAllPolicy(
    @UserLoggin() u: UserDocument,
    @Query() query: (Rating & SortPaginate) | any,
  ) {
    return this.ratingsService.findAll({
      userId: new Types.ObjectId(u?._id),
      ...query,
    });
    // .populate('store owner user shift');
  }
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.ratingsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.updateOne(id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.ratingsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
