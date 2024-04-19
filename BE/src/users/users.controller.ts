import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoggin } from 'src/auth/decorators/user';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/app/pipes/validation.pipe';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async createUser(@Body() data: any): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data?.password, saltOrRounds);
    const result = await this.usersService.create({
      ...data,
      password: hashedPassword,
      passwordRaw: data?.password,
    });
    return result;
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteOneById(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({
      _id: new Types.ObjectId(id),
    });
  }
  @Post('bulk/create')
  async createBulk(@Body() createUserDto: any[]) {
    try {
      const saltOrRounds = 10;
      const data = [];
      for (const e of createUserDto) {
        const hashedPassword = await bcrypt.hash(e?.password, saltOrRounds);
        data.push({ ...e, password: hashedPassword, passwordRaw: e?.password });
      }

      const rs = await this.usersService.createArray(data);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateDashboardDto: User,
  ) {
    delete updateDashboardDto?.username;
    if (updateDashboardDto?.password) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateDashboardDto?.password,
        saltOrRounds,
      );
      updateDashboardDto.passwordRaw = updateDashboardDto.password;
      updateDashboardDto.password = hashedPassword;
    }
    return this.usersService.updateOne(id, updateDashboardDto);
  }

  @Get()
  //current user
  async getAll(@UserLoggin() user: UserDocument, @Query() query: any) {
    const queries = {
      ...query,
      ...(query?.name && {
        name: { $regex: query?.name?.normalize(), $options: 'i' },
      }),

      // ...(query?.type ?? {
      type: query?.type || { $ne: 'CONSUMER' },
      // }),

      ...(query?.fullName && {
        fullName: { $regex: query?.fullName?.normalize(), $options: 'i' },
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
    const newUser = (await this.usersService.findAll(queries))?.map((e) => {
      if (e?.type === 'SUPER_ADMIN')
        return { ...e.toObject(), password: undefined, passwordRaw: undefined };
      return e?.toObject();
    });

    return newUser;
  }
}
