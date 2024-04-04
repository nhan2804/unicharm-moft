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
import { AnnoucementsService } from './annoucements.service';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';
import { Annoucement } from './entities/annoucements.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
@Controller('annoucements')
export class AnnoucementsController {
  constructor(private readonly annoucementsService: AnnoucementsService) {}

  @Post()
  create(@Body() createAnnoucementDto: CreateAnnoucementDto) {
    return this.annoucementsService.create(createAnnoucementDto);
  }
  @Post('bulk/create')
  createBulk(@Body() createAnnoucementDto: CreateAnnoucementDto[]) {
    return this.annoucementsService.createArray(createAnnoucementDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Annoucement & SortPaginate) | any,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),

      ...(query?.desc && {
        desc: { $regex: query?.desc?.normalize(), $options: 'i' },
      }),

      ...(query?.storeid && {
        storeid: { $regex: query?.storeid?.normalize(), $options: 'i' },
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
    return this.annoucementsService.findAllWithPaginate(
      queries,
      {},
      sortObj,
      query?.page,
      query?.perPage,
    );
  }

  @Get('active')
  active(
    @Query()
    query: (Annoucement & SortPaginate) | any,
  ) {
    const currentDate = new Date();
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),

      ...(query?.desc && {
        desc: { $regex: query?.desc?.normalize(), $options: 'i' },
      }),

      ...(query?.storeid && {
        storeid: { $regex: query?.storeid?.normalize(), $options: 'i' },
      }),

      fromDate: { $lte: currentDate },
      toDate: { $gte: currentDate },
    };
    return this.annoucementsService.findAll(queries);
  }
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.annoucementsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnoucementDto: UpdateAnnoucementDto,
  ) {
    return this.annoucementsService.updateOne(id, updateAnnoucementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annoucementsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.annoucementsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
