import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './models/task.model';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Users } from 'src/users/models/users.schema';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { OpenaiService } from 'src/openai/openai.service';

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
        task.recommendations.push(recommendation);
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
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto);

    if (!task) throw new HttpException('Task not found', 404);

    return task;
  }

  async removeTask(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new HttpException('Task not found', 404);

    return task;
  }

  async uploadThumbnail(taskId: string, img: Express.Multer.File) {
    const task = await this.findOneById(taskId);
    console.log(task, img);
    await task.updateOne({
      thumbnail: img.path,
    });

    return task;
  }

  async findOneById(taskId: string): Promise<Task | null> {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new HttpException('Task not found', 404);

    return task;
  }
}
