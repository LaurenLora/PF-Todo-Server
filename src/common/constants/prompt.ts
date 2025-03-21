import { Task } from 'src/tasks/models/task.model';
import { Priority } from '../enums/priority.enum';
import { Status } from '../enums/status.enum';

export const firstApproach = (task: Task) => `
You are the AI assistant to help users about their tasks.
Your first mission is to give the best advice or recommendation for their tasks.
Your recommendation should be sharp and short.
Max 20 words

    """
    Task details will be like: 
    - Title: ${task.title}
    - Description: ${task.description}
    - Priority: ${task.priority}
    - Status: ${task.status}
    """

 Based on this task, provide a short and actionable recommendation.
`;

export const updateRecommendationPrompt = (oldTask: Task, newTask: Task) => `
You are the AI assistant to help users about their tasks.
Your first mission is to give the best advice or recommendation for their tasks.
Your recommendation should be sharp and short.
This task updated and you need the compare them and generate new recommendation for user task.

Priority Types: ${Object.values(Priority).join(', ')}
Status Types: ${Object.values(Status).join(', ')}

"""
Old Task Detail:
 - Title: ${oldTask.title}
 - Description: ${oldTask.description}
 - Priority: ${oldTask.priority}
 - Status: ${oldTask.status}
"""

"""
New Task Detail:
 - Title: ${newTask.title}
 - Description: ${newTask.description}
 - Priority: ${newTask.priority}
 - Status: ${newTask.status}


  Based on this task, provide a short and actionable recommendation.
`;
