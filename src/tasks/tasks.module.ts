import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models/task.model';
import { Users, UsersSchema } from 'src/users/models/users.schema';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    OpenaiModule,
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
