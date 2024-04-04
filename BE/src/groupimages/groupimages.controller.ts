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
import { GroupimagesService } from './groupimages.service';
import { CreateGroupimageDto } from './dto/create-groupimage.dto';
import { UpdateGroupimageDto } from './dto/update-groupimage.dto';
import { Groupimage } from './entities/groupimages.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
@Controller('group-image')
export class GroupimagesController {
  constructor(private readonly groupimagesService: GroupimagesService) {}

  @Post()
  create(@Body() createGroupimageDto: CreateGroupimageDto) {
    return this.groupimagesService.create(createGroupimageDto);
  }
  @Post('bulk/create')
  createBulk(@Body() createGroupimageDto: CreateGroupimageDto[]) {
    return this.groupimagesService.createArray(createGroupimageDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Groupimage & SortPaginate) | any,
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
    return this.groupimagesService.findAll(queries, undefined, undefined, {
      createdAt: 1,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.groupimagesService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupimageDto: UpdateGroupimageDto,
  ) {
    return this.groupimagesService.updateOne(id, updateGroupimageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupimagesService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.groupimagesService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
