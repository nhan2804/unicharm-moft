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
  Inject,
  InternalServerErrorException,
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
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UserLoggin } from 'src/auth/decorators/user';
import axios from 'axios';
@Controller('gift-clients/bill')
export class GiftClientsbillController {
  constructor(
    private readonly giftClientsService: GiftClientsService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly storeService: StoresService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
      ...extraData,
    } as GiftClient);

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
  async update(
    @Param('id') id: string,
    @Body() updateGiftClientDto: UpdateGiftClientDto,
    @UserLoggin() user: UserDocument,
  ) {
    const idString = id?.toString();
    const processing = await this.cacheManager.get(idString);
    if (processing) {
      throw new BadRequestException(
        'Bill đang được duyệt từ nơi khác, vui lòng thử lại!',
      );
    } else {
      await this.cacheManager.set(idString, '1', 1000 * 15);
    }
    const bill = await this.giftClientsService.findOne({
      _id: new Types.ObjectId(id),
    });
    if (bill?.status !== 'PENDING') {
      throw new BadRequestException('Bill đã được duyệt, vui lòng thử lại');
    }

    const keyCode = `${updateGiftClientDto?.codeBill
      ?.normalize?.()
      ?.trim()
      ?.toUpperCase()}-${
      updateGiftClientDto?.dateBill
    }-${bill?.storeId?.toString()}`;

    bill.status = updateGiftClientDto?.status;
    // const isNightTime = this.isNightTime(bill?.createdAt);
    // const isOverFiveMinutesCheckBill = dayjs(bill?.createdAt)
    //   .add(5, 'minute')
    //   .isBefore(dayjs());
    // if (!isNightTime && isOverFiveMinutesCheckBill) {
    //   bill.dateChecking = this.generateRandomDateFromNow(bill?.createdAt);
    // } else {
    bill.dateCheckingBill = new Date();
    // }

    // console.log({ updateGiftClientDto });

    const consumer = await this.userService.findOne({
      _id: new Types.ObjectId(bill?.consumerId),
    });
    if (!consumer) {
      throw new BadRequestException('Không tìm thấy consumer này!');
    }

    bill.updatorId = new Types.ObjectId(user?._id);
    try {
      if (updateGiftClientDto?.status === 'ACCEPTED') {
        if (!updateGiftClientDto?.codeBill || !updateGiftClientDto?.dateBill) {
          throw new BadRequestException('Permission Deny');
        }
        const checkCodeBillExist = await this.giftClientsService.findOne({
          keyCodeBill: keyCode,
          //đợi confirm
        });

        if (checkCodeBillExist) {
          throw new BadRequestException(
            'Mã của bill của siêu thị này đã được duyệt trong ngày, vui lòng xem lại danh sách bill đã duyệt',
          );
        }
        if (updateGiftClientDto?.productsBill) {
          bill.productsBill = updateGiftClientDto?.productsBill;
        }
        // if (updateGiftClientDto?.shift) {
        //   bill.shift = updateGiftClientDto?.shift;
        // }

        bill.keyCodeBill = keyCode;
        bill.codeBill = updateGiftClientDto?.codeBill;
        bill.dateBill = updateGiftClientDto?.dateBill;

        consumer.point = (consumer.point || 0) + 1;
        consumer.totalPoint = (consumer.totalPoint || 0) + 1;
        consumer.annoucement += 1;
        await consumer.save();
      }

      if (updateGiftClientDto?.status === 'DENY') {
        if (!updateGiftClientDto?.reasonBill) {
          throw new BadRequestException('Vui lòng nhập lý do!');
        }
        // await this.codeService.update(bill?.codeId, {
        //   status: 'PENDING',
        // });
        bill.reasonBill = updateGiftClientDto?.reasonBill;
        consumer.annoucement += 1;
        await consumer.save();
      }
      await bill.save();
      return bill;
    } catch (error) {
      if (error?.status === 400) {
        throw new BadRequestException(error?.message);
      } else {
        const dataMess = {
          text: `Có lỗi xảy ra, vui lòng liên hệ admin gấp, code:90001`,
          chat_id: `-1001730347331`,
          reply_markup: '',
        };
        await axios.post(
          'https://api.telegram.org/bot5204298058:AAHSCujWdQdsN24F8in3sCHqcZrlYxbishM/sendMessage',
          dataMess,
        );
        throw new InternalServerErrorException(
          'Có lỗi xảy ra, vui lòng thử lại. Vui lòng báo lại lỗi này với admin',
        );
      }
    }
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
