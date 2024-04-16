import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { GiftClient, GiftClientDocument } from './entities/gift-clients.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';

@Injectable()
export class GiftClientsService extends AbstractService<GiftClient> {
  constructor(
    @InjectModel(GiftClient.name)
    readonly model: Model<GiftClientDocument>,
  ) {
    super(model);
  }
  async getTodayByStoreId(storeId, query) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.model.find({
      storeId: new Types.ObjectId(storeId),
      createdAt: { $gte: startOfToday },
      status: 'DONE',
      ...query,
    });
  }
  async sendOtp(phone: string, code: string) {
    const base64Auth = Buffer.from('gsolutionapiunicharm:lb6iTJt5').toString(
      'base64',
    );
    const resSMS = await axios.post(
      'https://api-01.worldsms.vn/webapi/sendMTSMS',
      {
        from: 'GSolution',
        to: phone,
        text: `GSolution gui mat khau tu https://unicharm.work4u.tech. OTP cua quy khach la: ${code}, quy khach vui long cung cap ma OTP cho nhan vien tiep thi de duoc tham gia chuong trinh va nhan qua. Vui long khong cung cap ma OTP cho nguoi khac.`,
      },
      {
        headers: {
          Authorization: `Basic ${base64Auth}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const dataRes = resSMS?.data;
    // console.log({ dataRes });

    if (dataRes?.status?.toString() !== '1') {
      throw new BadRequestException(
        'Có lỗi xảy ra, vui lòng thử lại!' + dataRes?.status?.toString(),
      );
    }
  }
}
