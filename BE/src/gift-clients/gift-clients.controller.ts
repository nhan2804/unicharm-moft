import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GiftClientsService } from './gift-clients.service';
import { CreateGiftClientDto } from './dto/create-gift-client.dto';
import { UpdateGiftClientDto } from './dto/update-gift-client.dto';
import { GiftClient } from './entities/gift-clients.entity';
import getSortObjFromQuery from 'src/helper/getSortObjFromQuery';
import {
  ParseArrayObjectIdPipe,
  ParseObjectIdPipe,
} from 'src/app/pipes/validation.pipe';
import { Types } from 'mongoose';
import SortPaginate from 'src/app/types/sort-paginate';
import { Public } from 'src/auth/guards/public';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { StoresService } from 'src/stores/stores.service';
import { customAlphabet, nanoid } from 'nanoid';
import { User } from 'src/users/entities/user.entity';
@Controller('gift-clients')
export class GiftClientsController {
  constructor(
    private readonly giftClientsService: GiftClientsService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly storeService: StoresService,
  ) {}

  @Public()
  @Post('/consumer')
  async createConsumer(
    @Body()
    data: {
      phone: string;
      storeId: string;
      fullName: string;
      type: 'SELLING' | 'SAMPLING';
      productId?: string;
      imageBill?: string;
    },
  ) {
    if (!data?.phone || !data?.storeId) {
      throw new BadRequestException('Có lỗi xảy ra, vui lòng thử lại!');
    }
    let user = await this.userService.findOne({ phone: data?.phone });
    const existStore = await this.storeService.findOne({
      _id: data.storeId,
    });
    if (!existStore) {
      throw new BadRequestException('Link tham gia sai, vui lòng thử lại!');
    }
    if (!user) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash('nhanxxxxx', saltOrRounds);
      const username = nanoid(6);
      user = await this.userService.create({
        password: hashedPassword,
        phone: data?.phone,
        username: username,
        fullName: data?.fullName,
        type: 'CONSUMER',
      } as User);
    }
    let extraData = {};
    if (data?.type === 'SAMPLING') {
      extraData = { productId: data?.productId };
      const existGift = await this.giftClientsService.findOne({
        phone: data?.phone,
        type: 'SAMPLING',
      });
      if (existGift)
        throw new BadRequestException(
          'Không đủ điều kiện tham gia chương trình Sampling!',
        );
    }
    const otp = customAlphabet('1234567890qwertyuioplkjhgfdsaxxcvbnm', 6);
    const giftClient = await this.giftClientsService.create({
      code: otp()?.toLocaleLowerCase(),
      phone: data?.phone,
      consumerId: user?._id,
      storeId: new Types.ObjectId(data?.storeId),
      type: data?.type,
      ...extraData,
    });

    const token = await this.authService.login(user);
    return { login: token, justLogin: true, giftClient };
  }
  @Post()
  create(@Body() createGiftClientDto: CreateGiftClientDto) {
    return this.giftClientsService.create(createGiftClientDto);
  }
  @Post('bulk/create')
  createBulk(@Body() createGiftClientDto: CreateGiftClientDto[]) {
    return this.giftClientsService.createArray(createGiftClientDto);
  }
  @Get()
  findAll(
    @Query()
    query: (GiftClient & SortPaginate) | any,
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
    return this.giftClientsService.findAllWithPaginate(
      queries,
      {},
      sortObj,
      query?.page,
      query?.perPage,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.giftClientsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftClientDto: UpdateGiftClientDto,
  ) {
    return this.giftClientsService.updateOne(id, updateGiftClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftClientsService.deleteOneById(id);
  }
  @Delete('bulk/delete')
  deleteBulk(@Body('ids', ParseArrayObjectIdPipe) ids: Types.ObjectId[]) {
    return this.giftClientsService.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }
}
