import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { GetFilterDto } from './dto/get-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  public async create(createDto: CreateDto, user: User): Promise<Task> {
    const { title, description } = createDto;
    const task = Task.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    delete task.user;

    return task;
  }

  public get(filterDto: GetFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    return this.taskRepository.get(status, search, user);
  }

  public async getById(id: string, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!foundTask)
      throw new NotFoundException(`Task with ID "${id}" not found.`);

    return foundTask;
  }

  public async updateStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const foundTask = await this.getById(id, user);
    foundTask.status = status;

    await foundTask.save();

    return foundTask;
  }

  public async deleteById(id: string, user: User): Promise<void> {
    const deletedTask = await this.taskRepository.delete({
      id: id,
      userId: user.id,
    });

    if (deletedTask.affected === 0)
      throw new NotFoundException(`Task with ID "${id}" not found.`);
  }
}
