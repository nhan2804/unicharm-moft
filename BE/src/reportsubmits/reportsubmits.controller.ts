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
import { ReportsubmitsService, TypeReport } from './reportsubmits.service';
import { CreateReportsubmitDto } from './dto/create-reportsubmit.dto';
import { UpdateReportsubmitDto } from './dto/update-reportsubmit.dto';
import { Reportsubmit } from './entities/reportsubmits.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserDocument } from 'src/users/entities/user.entity';
import { UserLoggin } from 'src/auth/decorators/user';
import { CheckinService } from 'src/checkin/checkin.service';
@Controller('stores/:placeId/report')
export class ReportsubmitsController {
  constructor(
    private readonly reportsubmitsService: ReportsubmitsService,
    private readonly checkinService: CheckinService,
  ) {}

  @Post('sale')
  async create(
    @Body() createReportsubmitDto: CreateReportsubmitDto,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @Body('data') data: object,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;

    const todayReport = await this.reportsubmitsService.getReportByStoreId(
      placeId,
      'sale',
      shiftId,
    );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      type: 'sale',
      data: data,
      shiftId: shiftId,
    };
    if (todayReport) {
      return this.reportsubmitsService.updateOne(todayReport?._id, {
        ...createReportsubmitDto,
        updatorId: user?._id,
      });
    }
    return this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
  }
  @Get('sup/today')
  async getReportSubToday(
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Query('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    return this.reportsubmitsService.getReportTodayByUserId(
      placeId,
      'sup',
      shiftId,
      user?._id,
    );
  }
  @Get(':type/today')
  async getReportToday(
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Query('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @Param('type') type: TypeReport,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    return this.reportsubmitsService.getReportByStoreId(placeId, type, shiftId);
  }
  @Post('gift')
  async createGift(
    @Body() createReportsubmitDto: CreateReportsubmitDto,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    const todayReport = await this.reportsubmitsService.getReportByStoreId(
      placeId,
      'gift',
      shiftId,
    );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      type: 'gift',
      startShiftInventory: createReportsubmitDto?.startShiftInventory,
      midShiftAddProduct: createReportsubmitDto?.midShiftAddProduct,
      endShiftInventory: createReportsubmitDto?.endShiftInventory,
      shiftId: shiftId,
    };
    if (todayReport) {
      return this.reportsubmitsService.updateOne(todayReport?._id, {
        ...createReportsubmitDto,
        updatorId: user?._id,
      });
    }
    return this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
  }
  @Post('oos')
  async createOos(
    @Body() createReportsubmitDto: CreateReportsubmitDto,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    const todayReport = await this.reportsubmitsService.getReportByStoreId(
      placeId,
      'oos',
      shiftId,
    );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      type: 'oos',
      kind: createReportsubmitDto?.kind,
      endShiftInventoryOOS: createReportsubmitDto?.endShiftInventoryOOS,
      startShiftInventoryOOS: createReportsubmitDto?.startShiftInventoryOOS,
      midShiftAddProductOOS: createReportsubmitDto?.midShiftAddProductOOS,
      shiftId: shiftId,
    };
    if (todayReport) {
      return this.reportsubmitsService.updateOne(todayReport?._id, {
        ...createReportsubmitDto,
        updatorId: user?._id,
      });
    }
    return this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
  }

  @Post('sampling')
  async createSampling(
    @Body() createReportsubmitDto: CreateReportsubmitDto,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    const todayReport = await this.reportsubmitsService.getReportByStoreId(
      placeId,
      'sampling',
      shiftId,
    );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      shiftId: shiftId,
      type: 'sampling',
      endShiftInventorySampling:
        createReportsubmitDto?.endShiftInventorySampling,
      midShiftAddProductSampling:
        createReportsubmitDto?.midShiftAddProductSampling,
      startShiftInventorySampling:
        createReportsubmitDto?.startShiftInventorySampling,
      usingSampling: createReportsubmitDto?.usingSampling,
    };
    if (todayReport) {
      return this.reportsubmitsService.updateOne(todayReport?._id, {
        ...createReportsubmitDto,
        updatorId: user?._id,
      });
    }
    return this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
  }
  @Post('sup')
  async createForSup(
    @Body()
    createReportsubmitDto: CreateReportsubmitDto & { currentId: string },
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    // const todayReport = await this.reportsubmitsService.getReportTodayByUserId(
    //   placeId,
    //   'sampling',
    //   shiftId,
    //   user?._id,
    // );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      shiftId: shiftId,
      type: 'sup',
      dataImage: createReportsubmitDto?.dataImage,
    };
    if (createReportsubmitDto?.currentId) {
      return this.reportsubmitsService.updateOne(
        createReportsubmitDto?.currentId,
        {
          dataImage: createReportsubmitDto?.dataImage,
          updatorId: user?._id,
        } as CreateReportsubmitDto,
      );
    }
    return this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
  }

  @Post('image')
  async createImage(
    @Body() createReportsubmitDto: CreateReportsubmitDto,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Body('checkinId', ParseObjectIdPipe) checkinId: Types.ObjectId,
    @UserLoggin() user: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(checkinId);
    const shiftId = currentCheckin?.shiftId;
    const todayReport = await this.reportsubmitsService.getReportByStoreId(
      placeId,
      'image',
      shiftId,
    );

    createReportsubmitDto = {
      ...createReportsubmitDto,
      storeId: placeId,
      type: 'image',
      //d
      dataImage: createReportsubmitDto?.dataImage,
      shiftId: shiftId,
      checkinId,
    };
    if (todayReport) {
      const report = await this.reportsubmitsService.updateOne(
        todayReport?._id,
        {
          ...createReportsubmitDto,
          updatorId: user?._id,
        },
      );
      currentCheckin.reportImageId = new Types.ObjectId(todayReport?._id);
      await currentCheckin.save();

      return report;
    }
    const report = await this.reportsubmitsService.create({
      ...createReportsubmitDto,
      creatorId: user?._id,
    });
    currentCheckin.reportImageId = report?._id;
    await currentCheckin.save();
    return report;
  }

  @Post('bulk/create')
  createBulk(@Body() createReportsubmitDto: CreateReportsubmitDto[]) {
    return this.reportsubmitsService.createArray(createReportsubmitDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Reportsubmit & SortPaginate) | any,
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
    return this.reportsubmitsService.findAllWithPaginate(
      queries,
      {},
      sortObj,
      query?.page,
      query?.perPage,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.reportsubmitsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportsubmitDto: UpdateReportsubmitDto,
    @UserLoggin() user: UserDocument,
  ) {
    return this.reportsubmitsService.updateOne(id, {
      ...updateReportsubmitDto,
      updatorId: new Types.ObjectId(user?._id),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsubmitsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.reportsubmitsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
