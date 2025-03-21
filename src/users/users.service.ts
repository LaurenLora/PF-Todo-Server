import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './models/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPassword } from 'src/common/utils/hash';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);
      const user = new this.userModel({
        ...createUserDto,
        hashedPassword: hashedPassword,
      });
      return await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id).populate('tasks');

    if (!user) throw new HttpException(`${id} this user not found`, 404);

    return user;
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) throw new HttpException('User not found', 404);

    return user;
  }

  async findAll(): Promise<Users[]> {
    return await this.userModel.find();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Users | null> {
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
    );

    if (!updateUser) throw new HttpException('User not found', 404);

    return updateUser;
  }

  async remove(id: string): Promise<Users | null> {
    const deleteUser = await this.userModel.findByIdAndDelete(id);

    if (!deleteUser) throw new HttpException('User not found', 404);

    return deleteUser;
  }
}
