import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  getTaskById(id: string): Promise<Task> {
    const task = this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { title, description } = updateTaskDto;
    const task = await this.getTaskById(id);

    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    await this.tasksRepository.update(id, task);

    return task;
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.update(id, task);

    return task;
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
