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
import { GiftexchangesService } from './giftexchanges.service';
import { CreateGiftexchangeDto } from './dto/create-giftexchange.dto';
import { UpdateGiftexchangeDto } from './dto/update-giftexchange.dto';
import {
  Giftexchange,
  GiftexchangeDocument,
} from './entities/giftexchanges.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
import { CheckinService } from 'src/checkin/checkin.service';
@Controller('stores/:placeId/gift-exchange')
export class GiftexchangesController {
  constructor(
    private readonly giftexchangesService: GiftexchangesService,
    private readonly checkinService: CheckinService,
  ) {}

  @Post()
  async create(
    @Body() createGiftexchangeDto: CreateGiftexchangeDto,
    @UserLoggin() user: UserDocument,
    @Param('placeId', ParseObjectIdPipe) storeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;

    const data: CreateGiftexchangeDto = {
      ...createGiftexchangeDto,
      storeId,
      checkinId,
      shiftId,
      creatorId: new Types.ObjectId(user?._id),
    };

    return this.giftexchangesService.create(data);
  }
  @Post('bulk/create')
  createBulk(@Body() createGiftexchangeDto: CreateGiftexchangeDto[]) {
    return this.giftexchangesService.createArray(createGiftexchangeDto);
  }
  @Get('/today')
  async findAllToday(
    @Query()
    query: (Giftexchange & SortPaginate) | any,
    @Param('placeId', ParseObjectIdPipe) storeId: Types.ObjectId,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const currentCheckin = await this.checkinService.findOneById(
      query?.checkinId,
    );
    const shiftId = currentCheckin?.shiftId;

    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      storeId: storeId,
      shiftId: new Types.ObjectId(shiftId),
      createdAt: { $gte: startOfToday },
      ...(Number(query?.startTime) &&
        Number(query?.endTime) && {
          createdAt: {
            $gte: new Date(Number(query?.startTime)),
            $lte: new Date(Number(query?.endTime)),
          },
        }),
    };
    return this.giftexchangesService
      .findAll(queries)
      .populate('owner store shift');
  }
  @Get()
  findAll(
    @Query()
    query: (Giftexchange & SortPaginate) | any,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),
    };
    return this.giftexchangesService.findAllWithPaginate(
      queries,
      {},
      sortObj,
      query?.page,
      query?.perPage,
      ['owner', 'store'],
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.giftexchangesService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftexchangeDto: UpdateGiftexchangeDto,
  ) {
    return this.giftexchangesService.updateOne(id, updateGiftexchangeDto);
  }
  //
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftexchangesService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.giftexchangesService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
