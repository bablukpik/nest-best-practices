import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getAllTasks() {
    return 'Tasks from service';
  }

  createTask(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
