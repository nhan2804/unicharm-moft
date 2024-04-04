import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import {
  Notification,
  NotificationDocument,
} from './entities/notifications.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService extends AbstractService<Notification> {
  constructor(
    @InjectModel(Notification.name)
    readonly model: Model<NotificationDocument>,
  ) {
    super(model);
  }
}
