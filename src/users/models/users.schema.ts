import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
