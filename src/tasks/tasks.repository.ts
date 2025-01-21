import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  // Repository methods create() and save() are used which is the TypeORM recommended pattern
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: status || TaskStatus.OPEN, // Use provided status or default to OPEN
    });

    await this.save(task);
    return task;
  }
}
