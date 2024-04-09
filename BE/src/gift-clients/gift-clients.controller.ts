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
import { User, UserDocument } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { UserLoggin } from 'src/auth/decorators/user';
@Controller('gift-clients')
export class GiftClientsController {
  constructor(
    private readonly giftClientsService: GiftClientsService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly storeService: StoresService,
    private readonly productService: ProductsService,
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
      products?: object;
      imgBill?: string;
    },
    // @UserLoggin() currentUser: UserDocument,
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
      extraData = { products: data?.products };
      const existGift = await this.giftClientsService.findOne({
        phone: data?.phone,
        type: 'SAMPLING',
      });
      if (existGift) {
        if (existGift?.status === 'PENDING')
          throw new BadRequestException(
            'Vui lòng kiểm tra OTP đã được gửi vào số điện thoại của bạn!',
          );
        else
          throw new BadRequestException(
            'Không đủ điều kiện tham gia chương trình Sampling!',
          );
      }
    }
    const otp = customAlphabet('1234567890qwertyuioplkjhgfdsaxxcvbnm', 6);
    const giftClient = await this.giftClientsService.create({
      code: otp()?.toLocaleLowerCase(),
      phone: data?.phone,
      consumerId: user?._id,
      storeId: new Types.ObjectId(data?.storeId),
      type: data?.type,
      // creatorId: currentUser?._id,
      imgBill: data?.imgBill,
      ...extraData,
    } as GiftClient);

    const token = await this.authService.login(user);
    return { login: token, justLogin: true, giftClient };
  }
  @Get('store/:storeId/today')
  async today(@Param('storeId') storeId) {
    const data = await this.giftClientsService.getTodayByStoreId(storeId);
    return data;
  }
  @Post()
  create(@Body() createGiftClientDto: CreateGiftClientDto) {
    return this.giftClientsService.create(createGiftClientDto);
  }
  @Public()
  @Post('roll/:id')
  async roll(
    @Body() createGiftClientDto: CreateGiftClientDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    const bill = await this.giftClientsService.findOne({ _id: id });
    if (!bill) throw new BadRequestException('Bill not found');
    if (bill?.type === 'SAMPLING' || bill?.status !== 'ACCEPTED') {
      throw new BadRequestException('Bill không hợp lệ');
    }
    const store = await this.storeService.findOne({ _id: bill?.storeId });
    const gifts = Object.entries(store?.gifts || {}).filter(
      (e) => !!e[1] && e[1] > 0 && e[1] > (store?.giftsCurrent?.[e[0]] || 0),
    );
    if (gifts.length === 0)
      throw new BadRequestException('Đã hết quà, vui lòng quay lại sau!');
    const giftSelected = gifts?.[Math.floor(Math.random() * gifts?.length)];

    // const giftSelected = gift?.[Math.floor(Math.random() * gift?.length)];
    // if (!giftSelected) {
    //   throw new BadRequestException('Đã hết quà, vui lòng quay lại sau!');
    // }
    const otp = customAlphabet('1234567890qwertyuioplkjhgfdsaxxcvbnm', 6);
    bill.code = otp();
    bill.status = 'CONFIRM';
    bill.products = {
      [giftSelected?.[0]]: 1,
    };
    bill.save();
    this.storeService.updateOne(store?._id, {
      $inc: { [`giftsCurrent.${giftSelected?.[0]}`]: 1 },
    });
    // this.productService.updateOne(giftSelected?._id, {
    //   $inc: {
    //     current: 1,
    //   },
    // });
    return bill;
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
      ['store', 'creator'],
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.giftClientsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftClientDto: UpdateGiftClientDto,
    @UserLoggin() currentUser: UserDocument,
  ) {
    let extraUpdate = {};
    if (updateGiftClientDto?.imgClient) {
      extraUpdate = { creator: currentUser?._id };
    }
    return this.giftClientsService.updateOne(id, {
      ...updateGiftClientDto,
      ...extraUpdate,
    });
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
