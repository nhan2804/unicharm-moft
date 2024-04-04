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
import { FormschemasService } from './formschemas.service';
import { CreateFormschemaDto } from './dto/create-formschema.dto';
import { UpdateFormschemaDto } from './dto/update-formschema.dto';
import { Formschema } from './entities/formschemas.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { UserLoggin } from 'src/auth/decorators/user';
import { UserDocument } from 'src/users/entities/user.entity';
@Controller('form-schemas')
export class FormschemasController {
  constructor(private readonly formschemasService: FormschemasService) {}

  @Post()
  create(
    @Body() createFormschemaDto: CreateFormschemaDto,
    @UserLoggin() u: UserDocument,
  ) {
    return this.formschemasService.create({
      ...createFormschemaDto,
      creatorId: new Types.ObjectId(u?._id),
    });
  }
  @Post('bulk/create')
  createBulk(@Body() createFormschemaDto: CreateFormschemaDto[]) {
    return this.formschemasService.createArray(createFormschemaDto);
  }
  @Get()
  findAll(
    @Query()
    query: (Formschema & SortPaginate) | any,
  ) {
    const sortObj = getSortObjFromQuery(query?.sort);
    delete query?.sort;
    const queries = {
      ...(!query?.all && {
        isActive: true,
      }),
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
    return this.formschemasService.findAll(queries);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.formschemasService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormschemaDto: UpdateFormschemaDto,
  ) {
    return this.formschemasService.updateOne(id, updateFormschemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formschemasService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.formschemasService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
