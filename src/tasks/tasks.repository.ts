import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterTasksDto: FilterTasksDto): Promise<Task[]> {
    const { search, status } = filterTasksDto;

    // Create query builder
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
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
