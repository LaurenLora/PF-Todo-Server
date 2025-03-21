import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './models/task.model';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Users } from 'src/users/models/users.schema';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { OpenaiService } from 'src/openai/openai.service';
import {
  handleUploadFilesToCdn,
  handleUploadFileToCdn,
} from 'src/common/config/cdn.config';
import {
  maxSizeOfAttachFile,
  maxSizeOfImage,
  validTypeOfAttachFile,
  validTypesOfImages,
} from 'src/common/constants/validation';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Users.name) private readonly userModel: Model<Task>,
    private readonly openaiService: OpenaiService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userModel.findById(createTaskDto.userId);

    if (!user) throw new HttpException('User not found', 404);

    const task = new this.taskModel(createTaskDto);
    try {
      const recommendation =
        await this.openaiService.createRecommendation(task);

      if (recommendation) {
        task.recommendations = recommendation;
      }

      const saveTask = await task.save();

      await user.updateOne({
        $push: {
          tasks: saveTask.id,
        },
      });

      return saveTask;
    } catch (error) {
      throw new HttpException('Task fail', 500);
    }
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const oldTask = await this.taskModel.findById(taskId);

    if (!oldTask) throw new HttpException('Task not found', 404);

    try {
      const task = await this.taskModel.findByIdAndUpdate(
        taskId,
        updateTaskDto,
        { new: true },
      );

      const newRecommendatition = await this.openaiService.updateRecommendation(
        oldTask,
        task,
      );

      if (newRecommendatition) {
        task.recommendations = newRecommendatition;
        await task.save();
      }

      return task;
    } catch (error) {
      console.log(error);
    }
  }

  async removeTask(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new HttpException('Task not found', 404);

    return task;
  }

  async uploadThumbnail(taskId: string, img: Express.Multer.File) {
    const task = await this.findOneById(taskId);

    if (!validTypesOfImages.includes(img.mimetype)) {
      throw new HttpException('Please choose JPG, PNG or WEBP', 500);
    }

    if (img.size > maxSizeOfImage) {
      throw new HttpException('Too large 15 MB max', 500);
    }

    await task.updateOne({
      thumbnail: img.path,
    });

    await handleUploadFileToCdn(img, img.path);

    return task;
  }

  async findOneById(taskId: string): Promise<Task | null> {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new HttpException('Task not found', 404);

    return task;
  }

  async attachFile(taskId: string, files: Express.Multer.File[]) {
    if (files.length < 0) throw new HttpException('File yokkiss', 400);

    const task = await this.findOneById(taskId);

    const arr: string[] = [];

    for (const file of files) {
      if (!validTypeOfAttachFile.includes(file.mimetype))
        throw new HttpException('Please choose valid tpye', 500);

      if (file.size > maxSizeOfAttachFile) {
        throw new HttpException('Please choose valid size', 500);
      }
      const filePath = file.path;
      arr.push(filePath);
    }

    task.files = [...task.files, ...arr];

    await handleUploadFilesToCdn(files, arr);

    return await task.save();
  }

  async findAllTasksByUserId(userId: string): Promise<Task[] | null> {
    const tasks = await this.taskModel.find({ userId: userId }).exec();

    if (!tasks || tasks.length === 0) {
      return null;
    }
    return tasks;
  }
}
