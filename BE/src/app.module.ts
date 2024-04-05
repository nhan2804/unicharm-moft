import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { FilterMiddleware } from './middleware/filter.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategy/auth.local';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { OptionsModule } from './options/options.module';
import { SubmitsModule } from './submits/submits.module';
import { UploadModule } from './upload/upload.module';
import { CheckinModule } from './checkin/checkin.module';
import { GroupQuestionModule } from './group-question/group-question.module';
import { GroupUsersModule } from './group-users/group-users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogsubmitsModule } from './logsubmits/logsubmits.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { ShiftsModule } from './shifts/shifts.module';
import { AnnoucementsModule } from './annoucements/annoucements.module';
import { QuestionsModule } from './questions/questions.module';
import { ReportsubmitsModule } from './reportsubmits/reportsubmits.module';
import { QuestionsubmitsModule } from './questionsubmits/questionsubmits.module';
import { ImagesModule } from './images/images.module';
import { GiftexchangesModule } from './giftexchanges/giftexchanges.module';
import { FormschemasModule } from './formschemas/formschemas.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RatingsModule } from './ratings/ratings.module';
import { DepartmentsModule } from './departments/departments.module';
import { Groupimage } from './groupimages/entities/groupimages.entity';
import { GroupimagesModule } from './groupimages/groupimages.module';
import { GiftClientsModule } from './gift-clients/gift-clients.module';
import { PoliciesModule } from './policys/policys.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ProjectsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    PassportModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CheckinModule,
    GiftClientsModule,
    OptionsModule,
    SubmitsModule,
    UploadModule,
    ReportsubmitsModule,
    ShiftsModule,
    PlacesModule,

    GroupQuestionModule,

    GroupUsersModule,

    DashboardModule,

    LogsubmitsModule,

    ProductsModule,
    StoresModule,
    AnnoucementsModule,
    QuestionsModule,
    QuestionsubmitsModule,
    ImagesModule,
    GiftexchangesModule,
    FormschemasModule,
    NotificationsModule,
    RatingsModule,
    DepartmentsModule,
    GroupimagesModule,
    PoliciesModule,
    //d
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/*');
    consumer
      .apply(FilterMiddleware)
      .exclude({ path: '/public/*', method: RequestMethod.ALL })
      .forRoutes('/*');
  }
}
