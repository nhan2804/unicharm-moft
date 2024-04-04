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
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { ParseObjectIdPipe } from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
import { ReportsubmitsService } from 'src/reportsubmits/reportsubmits.service';
@Controller('checkin')
export class CheckinManagerController {
  constructor(
    private readonly checkinService: CheckinService,
    private readonly reportSubmitService: ReportsubmitsService,
  ) {}

  @Get()
  findAll(@UserLoggin() u: UserDocument, @Query() query: any) {
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
    return this.checkinService.findAll(queries).populate('owner store shift');
  }
  @Post('report-image')
  reportImage(@UserLoggin() u: UserDocument, @Body('ids') ids: []) {
    const idsCheckin = ids?.map((e) => new Types.ObjectId(e));
    return this.reportSubmitService.findAll({
      checkinId: { $in: idsCheckin },
      type: 'image',
    });
  }
  @Post('report-image-sup')
  reportImageSup(@UserLoggin() u: UserDocument, @Body('ids') ids: []) {
    const idsCheckin = ids?.map((e) => new Types.ObjectId(e));
    return this.reportSubmitService.findAll({
      checkinId: { $in: idsCheckin },
      type: 'sup',
    });
  }
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.checkinService.deleteOneById(id);
    //l
  }
}
