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
import { ReportsubmitsService } from './reportsubmits.service';
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
@Controller('report')
export class ReportsubmitsManagerController {
  constructor(private readonly reportsubmitsService: ReportsubmitsService) {}

  @Get(':type')
  findAll(
    @Query()
    query: (Reportsubmit & SortPaginate) | any,
    @Param('type') type: string,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),
      type,
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

    return this.reportsubmitsService
      .findAll(queries, undefined, undefined, sortObj)
      .populate('checkin');
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.reportsubmitsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportsubmitDto: UpdateReportsubmitDto,
  ) {
    return this.reportsubmitsService.updateOne(id, updateReportsubmitDto);
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
