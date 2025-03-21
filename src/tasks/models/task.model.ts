import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Priority } from 'src/common/enums/priority.enum';
import { Status } from 'src/common/enums/status.enum';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  recommendations?: string;

  @Prop({ required: false })
  thumbnail?: string;

  @Prop({ required: false, type: [String], default: [] })
  files: string[];

  @Prop({ type: String, enum: Status, default: Status.TODO })
  status: Status;

  @Prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
