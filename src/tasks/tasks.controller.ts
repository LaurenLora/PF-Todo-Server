import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/config/storage.config';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async updateThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.tasksService.uploadThumbnail(id, file);
  }
}
