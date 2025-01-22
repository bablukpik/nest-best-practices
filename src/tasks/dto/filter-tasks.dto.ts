import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class FilterTasksDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
