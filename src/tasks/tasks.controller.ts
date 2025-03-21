import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/config/storage.config';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks/:userId')
  async findAllTasksByUserId(@Param('userId') userId: string) {
    return await this.tasksService.findAllTasksByUserId(userId);
  }

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Post('update/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async updateThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.tasksService.uploadThumbnail(id, file);
  }

  @Post('attach/:id')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  async attachFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.tasksService.attachFile(id, files);
  }
}
