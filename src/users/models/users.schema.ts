import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Task } from 'src/tasks/models/task.model';

@Schema({ timestamps: true })
export class Users extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
