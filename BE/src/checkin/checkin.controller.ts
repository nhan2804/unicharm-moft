import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { ParseObjectIdPipe } from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
import {
  ReportsubmitsService,
  TypeReport,
} from 'src/reportsubmits/reportsubmits.service';
import { UsersService } from 'src/users/users.service';
import { Checkin } from './entities/checkin.entity';
export const date2Str = (date: Date) => {
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
};
@Controller('stores/:placeId/checkin')
export class CheckinController {
  constructor(
    private readonly checkinService: CheckinService,
    private readonly userService: UsersService,
    private readonly reportSubmitService: ReportsubmitsService,
  ) {}

  @Post()
  async create(
    @Body() createCheckinDto: CreateCheckinDto,

    @UserLoggin() u: UserDocument,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const exists = await this.checkinService.findOne({
      storeId: placeId,
      shiftId: new Types.ObjectId(createCheckinDto?.shiftId),
      createdAt: { $gte: startOfToday },
      ownerId: new Types.ObjectId(u?._id),
    });
    if (exists) {
      throw new BadRequestException(
        'Ca này đã được checkin, bạn không thể checkin lại được!',
      );
    }
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(u?._id),
    });
    if (user?.type !== 'SUP') {
      const today = await this.checkinService.findAll({
        storeId: placeId,
        createdAt: { $gte: startOfToday },
        ownerId: new Types.ObjectId(u?._id),
      });
      const check = today?.every((e) => !!e?.timeCheckOut);
      if (!check) {
        throw new BadRequestException(
          'Ca checkin gần nhất của bạn chưa checkout! Vui lòng checkout trước khi checkin lại!',
        );
      }
    }

    return this.checkinService.create({
      ...createCheckinDto,

      timeCheckIn: new Date(),
      ownerId: new Types.ObjectId(u?._id),
      placeId,
      storeId: placeId,
    });
  }

  @Get()
  findAll(
    @UserLoggin() u: UserDocument,

    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.checkinService
      .findAll({
        ownerId: new Types.ObjectId(u?._id),
        placeId,
        createdAt: { $gte: startOfToday },
      })
      .populate('shift');
  }
  @Get('rating')
  findAllForRating(
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
    @Query('shiftId') shiftId: string,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const query = {
      placeId,
      createdAt: { $gte: startOfToday },
      ...(shiftId && {
        shiftId: new Types.ObjectId(shiftId),
      }),
    };
    return this.checkinService.findAll(query).populate('owner');
  }
  @Get('overview')
  findAllCheckin(@UserLoggin() u: UserDocument, @Query() query: Checkin | any) {
    return this.checkinService
      .findAll({
        ownerId: new Types.ObjectId(u?._id),
        ...query,
      })

      .populate('shift');
  }

  @Get('/today')
  async today(
    @UserLoggin() u: UserDocument,
    @Param('placeId', ParseObjectIdPipe) placeId: Types.ObjectId,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const checkin = await this.checkinService.findOne({
      ownerId: new Types.ObjectId(u?._id),

      createdAt: { $gte: startOfToday },
      placeId,
      timeCheckOut: { $exists: false },
    });
    if (checkin?.timeCheckOut) {
      return null;
    }
    return checkin;
  }
  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Param('placeId') placeId: string,
  ) {
    if (!placeId) {
      return undefined;
    }
    const checkin = await this.checkinService.findOne(id);
    if (!checkin) return undefined;
    const createdAt = new Date(checkin?.createdAt);
    const currentDate = new Date();
    const isValid =
      placeId === checkin?.storeId?.toString() &&
      date2Str(currentDate) === date2Str(createdAt) &&
      !checkin?.timeCheckOut;
    return { ...checkin?.toObject(), isValid };
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UserLoggin() u: UserDocument,
    @Body()
    updatePlaceDto: UpdateCheckinDto & {
      updateTimeCheckIn: Date;
      updateTimeCheckOut: Date;
    },
  ) {
    // const check = sameDay(new Date(place?.timeCheckIn), new Date());
    // if (updatePlaceDto?.updateTimeCheckIn) {
    //   return this.checkinService.baseUpdateOne(id, {
    //     timeCheckIn: new Date(),
    //   });
    // }
    const checkin = await this.checkinService.findOne({
      _id: new Types.ObjectId(id),
    });
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(u?._id),
    });
    if (!checkin) throw new BadRequestException();
    if (updatePlaceDto?.updateTimeCheckOut) {
      if (user?.type !== 'SUP') {
        const arr = ['sale', 'oos'];
        const rs = [];
        for (const typeReport of arr) {
          const check = await this.reportSubmitService.getReportByStoreId(
            checkin.storeId,
            typeReport as TypeReport,
            checkin.shiftId,
          );
          if (!check) {
            rs.push(typeReport);
          }
        }
        if (rs.length > 0) {
          throw new BadRequestException(
            'Bạn cần phải submit tất cả report mới được checkout : ' +
              rs.join(','),
          );
        }
      }

      return this.checkinService.baseUpdateOne(id, {
        ...updatePlaceDto,
        timeCheckOut: new Date(),
      });
    }
    return this.checkinService.baseUpdateOne(id, updatePlaceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    // return this.checkinService.remove(+id);
  }
}
