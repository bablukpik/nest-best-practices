import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    // First update the task
    await this.tasksRepository.update(id, { status });

    // Then fetch and return the updated task
    const task = await this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
