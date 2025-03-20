import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Users } from './models/users.schema';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Users> {
    return await this.usersService.findOneById(id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<Users> {
    return await this.usersService.findOneByEmail(email);
  }

  @Get('')
  async findAll(): Promise<Users[] | null> {
    return await this.usersService.findAll();
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
