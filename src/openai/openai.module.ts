import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/tasks/models/task.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
