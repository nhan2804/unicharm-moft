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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notifications.entity';
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
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly checkinService: CheckinService,
  ) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @UserLoggin() u: UserDocument,
  ) {
    const currentCheckin = await this.checkinService.findOneById(
      createNotificationDto?.checkinId,
    );
    const shiftId = currentCheckin?.shiftId;
    return this.notificationsService.create({
      ...createNotificationDto,
      ownerId: new Types.ObjectId(u?._id),
      fromTime: new Date(),
      shiftId,
    });
  }
  @Post('bulk/create')
  createBulk(@Body() createNotificationDto: CreateNotificationDto[]) {
    return this.notificationsService.createArray(createNotificationDto);
  }
  @Get()
  async findAll(
    @Query()
    query: (Notification & SortPaginate) | any,
    @UserLoggin() u: UserDocument,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const currentCheckin = await this.checkinService.findOneById(
      query?.checkinId,
    );
    delete query?.checkinId;
    const shiftId = currentCheckin?.shiftId;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),
      ...(query?.only && {
        shiftId: new Types.ObjectId(shiftId),
        storeId: new Types.ObjectId(currentCheckin?.storeId),
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

    return this.notificationsService.findAll(queries).populate('owner store');
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.notificationsService.findOneById(id);
  }
  @Get('checkin/:checkinId')
  getCheckIn(@Param('checkinId', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.notificationsService.findOne({
      checkinId: id,
      status: 'PENDING',
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updateOne(id, {
      ...updateNotificationDto,
      toTime: new Date(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.notificationsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
