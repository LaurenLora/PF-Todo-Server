import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';
import { OPENAI_API_KEY } from 'src/common/constants';
import { firstApproach } from 'src/common/constants/prompt';
import { Task } from 'src/tasks/models/task.model';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  constructor(private readonly confService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.confService.getOrThrow<string>(OPENAI_API_KEY),
    });
  }

  async createRecommendation(task: Task) {
    if (!task) throw new HttpException('Task not found', 404);

    console.log(task);
    try {
      const res = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: firstApproach(task),
          },
        ],
      });
      const data = res.choices[0].message.content;
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException('LLM err', 500);
    }
  }
}
